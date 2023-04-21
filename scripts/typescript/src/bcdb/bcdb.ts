/**
 * The purpose of this script is to declare the Graph (defined in https://docs.google.com/presentation/d/1eXM7870YM2sxQQvMFahI2Ox8-EFCGaw_/edit#slide=id.p1)
 * and export it as a JSON file.
 *
 * Documentation reference on XSLX: https://docs.sheetjs.com/docs
 *
 * This script does not import all th sheets and columns.
 * See link to google drive files above (column_meanings.xlsx)
 */
import * as XLSX from "xlsx";
import * as fs from "fs";
import { Column } from "./types/column";
import { ICitation, ICollection, ICondition, IExperiment, IMaterial, IProcess, IProject, IReference } from "@cript";
import { Stream } from "stream";

export class BCDBLoader {
  /**
   * Loads a given BCDB file and converts it to a CRIPT Project
   */
  static async load(options: {
    input_file_path: string;
    //log?: Writable;
    sheets: ['blocks', 'diblock']; // added for the user to understand, but only expect a const array
    limitSheetRows: number;
  }): Promise<IProject> {
    // format errors
    function error(index: number | null, message: string) {
      /*
      if (index !== null) log_buffer.write(`ERR: line ${index}: ${message}\n`);
      else log_buffer.write(`ERR: ${message}\n`);   */
    }

    // Format messages
    function log(message: string) {    /*  
      log_buffer.write(`MSG: ${message}\n`);*/
    }

    //-- Load desired sheets

    log(`=-=-=-=-=-=-=-=-=-= RCBC XLSX to JSON =-=-=-=-=-=-=-=-=`);

    const workBook = XLSX.readFile(options.input_file_path, {
      sheets: options.sheets,
      sheetRows: options.limitSheetRows,
      cellHTML: false,
      cellFormula: false,
      dense: true, // really usefull to remove a lot of useless data
    });
    log(`OK`);

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

      log(`-- Found ${rows.length} row(s)`);

      rows
        .slice(1) // Skip header row.
        .forEach((row, index) => {
          const polymer = row["A"];
          const name = row["B"];
          const bigsmiles = row["C"];
          const entry = { index, polymer, name, bigsmiles };
          blocks.set(bigsmiles, entry);
        });
      log(`Found ${JSON.stringify([...blocks.values()], null, " ")} (${blocks.size} rows)`);
      log(`Storing blocks meta information ... DONE`);
    }

    {
      const sheetName = options.sheets[1];
      process.stdout.write(`Loading sheet ${sheetName} ...\n`);
      const rows: { [key: string]: string }[] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], {
        header: "A",
      });
      log(`-- Found ${rows.length} row(s)`);
      log(`-- Converting polymer rows to JSON ...`);

      rows
        .slice(2) // Skip 2 header rows
        .forEach((row, index, arr) => {
          index % 100 == 0 && process.stdout.write(`-- Loading row ${index}/${arr.length - 1}\n`);

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
              type: "", // TODO: pick a reference-type key from vocab
            };
            if (reference.doi) {
              references.set(reference.doi, reference);
            } else {
              error(index, `Unable to store this reference, it has no doi (we use it as a key)`);
            }
          }
          //log(`Reference read: ${reference.doi}`);

          //-- citation
          //   to reference the reference (haha)
          const citation: ICitation = {
            // uid: will be determined by CriptJSON serializer
            name: `RCBC Citation ${index}`,
            node: ["Citation"],
            type: "reference",
            reference,
          };

          //-- product (Overall polymer)
          //   note: we do not reuse existing polymers,
          //         because we have to attach similar properties
          //         on similar polymers (matching in term of bigsmiles)
          const bigsmiles = row[Column.BigSMILES];
          const polymer: IMaterial = {
            node: ["Material"],
            name: `RCBC Material ${index}`,
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
            value: row[Column.Mn],
            method: row[Column.Mn_method],
            unit: "g/mol",
          });
          polymer.property.push({
            node: ["Property"],
            key: "mw_w",
            value: row[Column.Mw],
            method: row[Column.Mw_method],
            unit: "g/mol",
          });
          polymer.property.push({
            node: ["Property"],
            key: "mw_d",
            value: row[Column.D],
            method: row[Column.D_method],
            unit: "g/mol",
          });
          polymer.property.push({
            node: ["Property"],
            key: "invariant_degree_of_polymerization",
            value: row[Column.N],
            method: row[Column.N_method],
            //unit: undefined
          });
          polymer.property.push({
            node: ["Property"],
            key: "temperature",
            unit: "degC",
            value: row[Column.T],
          });

          const phase_method = row[Column.phase_method] ?? "";
          const condition: ICondition = {
            node: ["Condition"],
            key: "phase_method",
            value: phase_method.toLowerCase(), // saxs, tem, rheology
          };
          polymer.property.push({
            node: ["Property"],
            key: "microstructure_phase",
            notes: "phase1",
            value: row[Column.PHASE1],
            condition: [{...condition}]
          });
          polymer.property.push({
            node: ["Property"],
            key: "microstructure_phase",
            notes: "phase2",
            value: row[Column.PHASE2],
            condition: [{...condition}],
          });

          //-- Individual Block 1
          //   name and properties (Mn, Mw, D, N, f, ftot, w, rho)
          const block1: IMaterial = {
            name: row[Column.name1],
            node: ["Material"],
            property: [
              {
                node: ["Property"],
                key: "mw_w",
                value: row[Column.Mw1],
                method: row[Column.Mw1_method],
                unit: "g/mol",
              },
              {
                node: ["Property"],
                key: "mw_d",
                value: row[Column.D1],
                method: row[Column.D1_method],
                unit: "g/mol",
              },
              {
                node: ["Property"],
                key: "invariant_degree_of_polymerization",
                value: row[Column.N1],
                method: row[Column.N1_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                value: row[Column.f1],
                method: row[Column.f1_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                value: row[Column.ftot1],
                method: row[Column.ftot1_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "conc_mass_fraction",
                value: row[Column.w1],
                method: row[Column.w1_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "density",
                value: row[Column.rho1],
                method: row[Column.rho1_method],
                unit: "g/mL",
              },
              {
                node: ["Property"],
                key: "microstructure_phase",
                value: `${row[Column.PHASE1]},${row[Column.PHASE2]}`,
                method: row[Column.rho1_method],
                unit: "g/mL",
              },
            ],
          };
          project.material.push(block1);

          //-- Individual Block 2
          //   name and properties (Mn, Mw, D, N, f, ftot, w, rho)
          const block2: IMaterial = {
            name: row[Column.name2],
            node: ["Material"],
            property: [
              {
                node: ["Property"],
                key: "mw_w",
                value: row[Column.Mw2],
                method: row[Column.Mw2_method],
                unit: "g/mol",
              },
              {
                node: ["Property"],
                key: "mw_d",
                value: row[Column.D2],
                method: row[Column.D2_method],
                unit: "g/mol",
              },
              {
                node: ["Property"],
                key: "invariant_degree_of_polymerization",
                value: row[Column.N2],
                method: row[Column.N2_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                value: row[Column.f2],
                method: row[Column.f2_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "conc_vol_fraction",
                value: row[Column.ftot2],
                method: row[Column.ftot2_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "conc_mass_fraction",
                value: row[Column.w2],
                method: row[Column.w2_method],
                //unit: undefined
              },
              {
                node: ["Property"],
                key: "density",
                value: row[Column.rho2],
                method: row[Column.rho2_method],
                unit: "g/mL",
              },
            ],
          };
          project.material.push(block2);

          //log(`Add blocks to process as ingredients ...`);

          polymer.component = [block1, block2];

          //-- add meta data for each material
          project.material.forEach((material) => {
            if (!material.bigsmiles) return log(`No bigsmiles found for ${material.name}`);

            // try to get meta data from blocks map
            const metaData = blocks.get(material.bigsmiles);
            if (!metaData) return error(index, `No meta data found (in blocks) for ${material.bigsmiles}, keep name: ${material.name} `);
            polymer.name = metaData.name;
            polymer.names = [metaData.polymer];
            //log(`Meta data found, name and names[] added`);
          });
        });
    }

    return project;
  } // load()
} // namespace BCDBLoader
