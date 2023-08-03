/**
 * The purpose of this script is to load  bdcb.xlsx file and export it as a JSON file.
 *
 *
 * Documentation reference on XSLX: https://docs.sheetjs.com/docs
 *
 * This script does not import all the sheets and columns.
 * See link to google drive files above (column_meanings.xlsx)
 */
import * as XLSX from "xlsx";
import { Column } from "./types/column";
import { ICitation, ICollection, ICondition, IMaterial, IProject, IReference } from "@cript";
import { CriptGraphOptimizer, CriptProjectValidator, LogLevel, Logger, LoggerOptions } from "@utilities";

export class BCDBLoader {
  readonly logger: Logger;

  constructor(options: {
    logger: LoggerOptions;
  } = { logger: { outstream: process.stdout, verbosity: LogLevel.INFO, timestamp: true }})
  {
    this.logger = new Logger(options.logger);
  }

  /**
   * Loads a given BCDB file and converts it to a CRIPT Project.
   * 
   * The output IProject has the garantee to be optimized and validated against the DB schema,
   * otherwise an exception will be thrown.
   */
  async load(options: {
    input_file_path: string;
    sheets: ['blocks', 'diblock']; // added for the user to understand, but only expect a const array
    limitSheetRows: number;
  }): Promise<IProject> {

    //-- Load desired sheets

    this.logger.info(`=-=-=-=-=-=-=-=-=-= BCDB XLSX to JSON =-=-=-=-=-=-=-=-=`);

    const workBook = XLSX.readFile(options.input_file_path, {
      sheets: options.sheets,
      sheetRows: options.limitSheetRows,
      cellHTML: false,
      cellFormula: false,
      dense: true, // really usefull to remove a lot of useless data
    });

    //-- Load the sheets

    const project = {
      name: "BCDB",
      model_version: "1.0.0",
      node: ["Project"],
      collection: new Array<ICollection>(),
      material: new Array<IMaterial>(),
    } satisfies IProject;

    // Store references as: doi => IReference
    const references = new Map<string, IReference>();
    // Store blocks as: bigsmiles => {...}
    const blocks = new Map<string, { index: number; polymer: string; bigsmiles: string; name: string }>();

    //-- Loads polymer/name/bigsmiles table
    {
      const sheetName = options.sheets[0];
      process.stdout.write(`Loading sheet ${sheetName} ...\n`);
      const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {
        header: "A",
      });

      this.logger.info(`-- Found ${rows.length} row(s)`);

      rows
        .slice(1) // Skip header row.
        .forEach((row, index) => {
          const polymer = row["A"];
          const name = row["B"];
          const bigsmiles = row["C"];
          const entry = { index, polymer, name, bigsmiles };
          blocks.set(bigsmiles, entry);
        });
      this.logger.info(`Found ${JSON.stringify([...blocks.values()], null, " ")} (${blocks.size} rows)`);
      this.logger.info(`Storing blocks meta information ... DONE`);
    }

    {
      const sheetName = options.sheets[1];
      process.stdout.write(`Loading sheet ${sheetName} ...\n`);
      const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {
        header: "A",
      });
      this.logger.info(`-- Found ${rows.length} row(s)`);
      this.logger.info(`-- Converting polymer rows to JSON ...`);

      rows
        .slice(2) // Skip 2 header rows
        .forEach((row, index, arr) => {
          index % 100 == 0 && process.stdout.write(`-- Converting rows ... ${index}/${arr.length - 1}\n`);
          this.logger.prefix = `[row ${String(index).padEnd(4)}]`;
          //-- reference
          //   to store DOI and ORCIDs
          const doi = row[Column.DOI];
          const author = row[Column.ORCID];
          let reference: IReference | undefined = references.get(doi);
          if (!reference) {
            reference = {
              node: ["Reference"],
              doi: doi,
              author: [author], // TODO: parse array
              type: "journal_article",
            };
            if (reference.doi) {
              references.set(reference.doi, reference);
            } else {
              this.logger.error(`Unable to store this reference, it has no doi (we use it as a key)`, JSON.stringify(reference));
            }
          }
          //log(`Reference read: ${reference.doi}`);

          //-- citation
          //   to reference the reference (haha)
          const citation: ICitation = {
            // uid: will be determined by CriptJSON serializer
            node: ["Citation"],
            type: "extracted_by_human",
            reference,
          };

          //-- product (Overall polymer)
          //   note: we do not reuse existing polymers,
          //         because we have to attach similar properties
          //         on similar polymers (matching in term of bigsmiles)
          const bigsmiles = row[Column.BigSMILES];
          const polymer: IMaterial = {
            node: ["Material"],
            name: `BCDB_Material_${index}`,
            bigsmiles,
            notes: row[Column.notes]
          };
          project.material.push(polymer);

          // log(`Added polymer: ${polymer.bigsmiles}`);

          //-- product's properties
          //   mw_n, mw_w, mw_d, invariant_degree_of_polymerization
          if (!polymer.property) polymer.property = [];
          polymer.property.push({
            node: ["Property"],
            key: "mw_n",
            type: 'value',
            value: row[Column.Mn],
            method: row[Column.Mn_method],
            unit: "g/mol",
            citation: [citation]
          });
          polymer.property.push({
            node: ["Property"],
            key: "mw_w",
            type: 'value',
            value: row[Column.Mw],
            method: row[Column.Mw_method],
            unit: "g/mol",
            citation: [citation]
          });
          polymer.property.push({
            node: ["Property"],
            key: "mw_d",
            type: 'value',
            value: row[Column.D],
            method: row[Column.D_method],
            unit: "g/mol",
            citation: [citation]
          });
          polymer.property.push({
            node: ["Property"],
            key: "invariant_degree_of_polymerization",
            type: 'value',
            value: row[Column.N],
            method: row[Column.N_method],
            citation: [citation],
            unit: null,
          });
          polymer.property.push({
            node: ["Property"],
            key: "temperature",
            type: 'value',
            unit: "degC",
            value: row[Column.T],
            citation: [citation]
          });

          // can be: "saxs", "tem", or "rheology"
          let phase_method = row[Column.phase_method]?.toLowerCase() ?? "";

          // The custom vocabulary does not allow "rheology"
          // Replacing with "rheometer".
          if(phase_method === "rheology")  phase_method = "rheometer";

          const condition: ICondition = {
            node: ["Condition"],
            key: "phase_method",
            value: phase_method, 
          };

          polymer.property.push({
            node: ["Property"],
            key: "microstructure_phase",
            type: 'value',
            notes: "phase1",
            value: row[Column.PHASE1],
            condition: [{...condition}],
            citation: [citation],
            unit: null,
          });
          polymer.property.push({
            node: ["Property"],
            key: "microstructure_phase",
            notes: "phase2",
            type: 'value',
            value: row[Column.PHASE2],
            condition: [{...condition}],
            citation: [citation],
            unit: null,
          });

          //-- Individual Block 1
          //   name and properties (Mn, Mw, D, N, f, ftot, w, rho)
          const block1: IMaterial = {
            name: `${polymer.name}_${row[Column.name1]}`,
            node: ["Material"],
            property: [
              {
                node: ["Property"],
                key: "mw_w",
              type: 'value',
                value: row[Column.Mw1],
                method: row[Column.Mw1_method],
                unit: "g/mol",
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "mw_d",
                type: 'value',
                value: row[Column.D1],
                method: row[Column.D1_method],
                unit: "g/mol",
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "invariant_degree_of_polymerization",
                type: 'value',
                value: row[Column.N1],
                method: row[Column.N1_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                type: 'value',
                value: row[Column.f1],
                method: row[Column.f1_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                type: 'value',
                value: row[Column.ftot1],
                method: row[Column.ftot1_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "conc_mass_fraction",
                type: 'value',
                value: row[Column.w1],
                method: row[Column.w1_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "density",
                type: 'value',
                value: row[Column.rho1],
                method: row[Column.rho1_method],
                unit: "g/mL",
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "microstructure_phase",
                type: 'value',
                value: `${row[Column.PHASE1]},${row[Column.PHASE2]}`,
                method: row[Column.rho1_method],
                unit: "g/mL",
                citation: [citation],
              },
            ],
          };
          project.material.push(block1);

          //-- Individual Block 2
          //   name and properties (Mn, Mw, D, N, f, ftot, w, rho)
          const block2: IMaterial = {
            name: `${polymer.name}_${row[Column.name2]}`,
            node: ["Material"],
            property: [
              {
                node: ["Property"],
                key: "mw_w",
                type: 'value',
                value: row[Column.Mw2],
                method: row[Column.Mw2_method],
                unit: "g/mol",
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "mw_d",
                type: 'value',
                value: row[Column.D2],
                method: row[Column.D2_method],
                unit: "g/mol",
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "invariant_degree_of_polymerization",
                type: 'value',
                value: row[Column.N2],
                method: row[Column.N2_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                type: 'value',
                value: row[Column.f2],
                method: row[Column.f2_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                type: 'value',
                value: row[Column.ftot2],
                method: row[Column.ftot2_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "conc_mass_fraction",
                type: 'value',
                value: row[Column.w2],
                method: row[Column.w2_method],
                unit: null,
                citation: [citation],
              },
              {
                node: ["Property"],
                key: "density",
                type: 'value',
                value: row[Column.rho2],
                method: row[Column.rho2_method],
                unit: "g/mL",
                citation: [citation],
              },
            ],
          };
          project.material.push(block2);

          this.logger.info(`Add blocks to process as ingredients ...`);
          polymer.component = [block1, block2];
        });
    }
    this.logger.prefix = null;

    //-- add meta data for each material
    for(const material of project.material) {
      if (!material.bigsmiles) {
        this.logger.info(`No bigsmiles found for ${material.name}`);
        continue;
      } 

      // try to get meta data from blocks map
      // meta data are coming from the 'blocks' tab in the xlsx
      const metaData = blocks.get(material.bigsmiles);
      if (!metaData) {
        this.logger.warning(`No meta data found (in blocks) for '${material.bigsmiles}', keep name: ${material.name} `);
        continue;
      }
      material.name = metaData.name;
      material.names = [metaData.polymer];
      this.logger.debug(`Meta data found for '${material.bigsmiles}', name and names[] added`);
    };

    // Optimise the project object (uses uids, create Edges, etc..)
    const optimizer = new CriptGraphOptimizer();
    const optimized_project: IProject = optimizer.get_optimized(project);

    // Validate against DB schema
    const validator = new CriptProjectValidator();
    const is_valid = await validator.validate('ProjectPost', optimized_project);

    if(!is_valid) {
      this.logger.error(validator.errorsAsString(10));
      this.logger.error(`Project '${optimized_project.name}' is NOT valid, see errors in logs above!`)
      throw new Error(`Project is NOT valid`);
    } else {
      this.logger.info(`Project '${optimized_project.name}' is valid.`)
    }

    return optimized_project;
  } // load()
} // namespace BCDBLoader
