/**
 * The purpose of this script is to load chi.xlsx file and export it as a JSON file.
 * The script also loads the content of method.xlsx, polymers.xlsx, and solvent.xlsx.
 *
 * Documentation reference on XSLX: https://docs.sheetjs.com/docs

 */
import * as XLSX from "xlsx";
import * as fs from "fs";
import { resolve } from "path";
import { ICitation, ICollection, ICondition, IMaterial, IProject, IProperty, IReference } from "@cript";
import { Chi, Method, Polymer, PubChemCASResponse, PubChemResponse as PubChemPropertyResponse, Solvent } from "./types";
import { molfile_to_bigsmiles } from "@cript-web/bigsmiles-toolkit";
import { CriptValidator, Logger, LogLevel, LoggerOptions, CriptGraphOptimizer } from "@utilities";
import { Other } from "./types/sheets/others";
import { fetch } from "cross-fetch";
export class PPPDBLoader {

  readonly logger: Logger;
  private project = this.createProject();
  private validator = new CriptValidator();

  private reference = {
    /** To ensure references are unique */
    by_name: new Map<string, IReference>(),
    /** To report any missing data */
    doi_title: {
      missing: new Set<string>(),
    },
  };
    
  private material = {
    /** To ensure references are unique */
    unique_name: new Set<string>(),
    /** Flag to mark when two materials with the same name have been added to the project */
    name: {
      has_duplicates: false,
    },
    bigsmiles: {
      missing: new Set<string>(),
      uniques: new Set<string>(),
    }
  }
  
  private molfile = {
    /**
     * Map each molfile name (lower-case, trimmed, no extension) to its molfile path.
     * The key should match potentially with the compound1 column.
     * "poly(developer)" => "C:/path/to/the/molfiles/folder/Poly(developer) .mol"
     */
    name_to_path: new Map<string, string>(),
    missing: new Set<string>(),
  }

  private polymer = {
    missing: new Set<string>(),
  }

  private solvent = {
    missing: new Set<string>(),
  }

  private method = {
    missing: new Set<string>(),
  }

  private other = {
    missing: new Set<string>(),
  }

  private xlsx = {
    chi: {
      parsed_row_count: 0,
      skipped_row_count: 0,
    }
  }

  constructor(options: { logger: LoggerOptions }) {
    this.logger = new Logger(options.logger);    
  }

  private createProject() {
    return {
      name: "PPPDB",
      model_version: "1.0.0",
      node: ["Project"],
      collection: new Array<ICollection>(),
      material: new Array<IMaterial>(),
    } satisfies IProject;
  }
  /**
   * Loads a given set of PPPDB files and converts it to a CRIPT Project
   */
  async load(options: {
    paths: {
      others: string,
      chi: string,
      methods: string,
      polymers: string,
      solvents: string,
      molfile_dir: string,
    };
    row_limit: number;
  }): Promise<IProject> {
    this.logger.prefix = null;
    this.logger.info(`PPPDB.load() ...`);
    this.logger.debug(`Reset state`);

    // clear state
    this.project = this.createProject();
    this.reference.by_name.clear();
    this.reference.doi_title.missing.clear();
    this.material.name.has_duplicates = false;
    this.material.bigsmiles.missing.clear();
    this.material.bigsmiles.uniques.clear();
    this.material.unique_name.clear();
    this.molfile.missing.clear();
    this.molfile.name_to_path.clear();
    this.polymer.missing.clear();
    this.solvent.missing.clear();
    this.method.missing.clear();
    this.other.missing.clear();
    this.xlsx.chi.parsed_row_count  = 0;
    this.xlsx.chi.skipped_row_count = 0;

    // Downloads DB schema
    await this.validator.init(); 

    /**
     * Global Strategy:
     * ----------------
     * 
     * - Create some citations for the row ('doi' and 'reference' columns)
     * - Create Materials 1 and 2 (depending of their type 'polymer' or 'solvent')
     * - Create a Material Combined (having Material 1 & 2 for component)
     */

    const parsing_options = {
      sheetRows: options.row_limit,
      cellHTML: false,
      cellFormula: false,
      index_offset: 1, // +1 because the header is skipped (we want indexes to be the same as the excel).
    };

    this.logger.info(`Loading *.xslx files ...`);
    const chi = this.load_first_sheet_from_xlsx<Chi>(options.paths.chi, parsing_options);
    const methods = this.load_first_sheet_from_xlsx<Method>(options.paths.methods, parsing_options);
    const polymers = this.load_first_sheet_from_xlsx<Polymer>(options.paths.polymers, parsing_options);
    const solvents = this.load_first_sheet_from_xlsx<Solvent>(options.paths.solvents, parsing_options);
    const others = this.load_first_sheet_from_xlsx<Other>(options.paths.others, parsing_options);
    this.logger.info(`Indexing molfiles from '${options.paths.molfile_dir}' ...`);
    try {      
      const file_names = fs.readdirSync(options.paths.molfile_dir);
      for(const file_name of file_names) {
        const clean_file_name = this.compute_normalized_molfile_clean_name(file_name);
        const absolute_file_path = resolve(options.paths.molfile_dir, file_name);
        this.molfile.name_to_path.set(clean_file_name, absolute_file_path);
        this.logger.debug(` ${ ("'" + clean_file_name + "'").padEnd(40)} => '${absolute_file_path}'`);
      }
    } catch( err: any ) {
      throw new Error(`Unable to index molfiles.\n${err.stack}`)
    }
    this.logger.info(`Found ${this.molfile.name_to_path.size} file(s)`);
    
    // double-check that "id" are unique
    const unique_id_count = new Set(chi.map( v => v.id)).size;
    const ids_are_unique = unique_id_count === chi.length;
    if(!ids_are_unique) {
      const message = `'id' column check: FAILED. \nThe column 'id' of '${options.paths.chi}' contains duplicates. Fix the file an run again.`;
      this.logger.error(message);
      throw new Error(message);
    } else {
      this.logger.info(`'id' column check: OK`)
    }

    for( const chi_row of chi) {

      // Print a message <progress_increment_count> times during the process
      // Since the log might not be emitted in the console (if options.log.outstream is !== stdout )
      // we need some feedback.
      const progress_increment_count = 25;
      if( chi_row._row_index % Math.floor(chi.length / progress_increment_count) === 0 ) {
        console.log(`Processing ${(chi_row._row_index/chi.length*100).toFixed(0)}% ...`)
      }

      // Define a prefix to identify the row index and id in each logged message
      const four_digit_row_index = chi_row._row_index.toString().padStart(4,'0');
      const four_digit_id = chi_row.id.toString().padStart(4,'0');
      this.logger.prefix = String(`[row: ${four_digit_row_index}, id: ${four_digit_id}] `);
      this.logger.debug(`Processing row ...`);

      // skip rows we do not handle (for now, 6/7/2023)
      switch( chi_row.type ) {
        case 'Type 1':
        case 'Type 2':
        case "Type 3":
          // We should handle those types
          break;
        case 'Type 4':
        case 'Type 5':
          this.logger.warning(`This row type is '${chi_row.type}' is not handled. The entire row will be skipped.`);
          this.xlsx.chi.skipped_row_count++;
          continue;
        default:
          const error_message = `This row type is unexpected '${chi_row.type}'.\nExpected values are 'Type 1' to 'Type 5'. Fix your xlsx file and retry`;
          this.logger.error(error_message);
          throw new Error(error_message);
      }

      // Create a unique for the whole row
      const shared_citation = await this.create_citations(chi_row);

      this.logger.debug(`Creating Material 1 ...`);
      
      const material1 = {            
        node: ['Material'],
        model_version: '1.0.0',
        name: `PPPDB_${chi_row.id}_${chi_row.compound1}`, // PPPDB_<Column AJ (id)>_<Column B (compound1) of chi.csv>
        names: [] as string[],
        property: [] as IProperty[],
      } satisfies IMaterial;
      if(chi_row.compound1) material1.names.push(chi_row.compound1);// "<Column B (compound1) of chi.csv (string)>',
      if(chi_row.ac1) material1.names.push(chi_row.ac1); // '<Column D (ac1) of chi.csv (string)>'

      this.logger.debug(`Material 1 is a ${chi_row.type1}`);
      switch( chi_row.type1 ) {
        case 'polymer': {
          this.assign_polymer_fields(material1, polymers, chi_row.compound1);
          const mw_w_property = this.create_mw_w_property(chi_row.molmass1, chi_row.molmassunit);
          if( mw_w_property ) {
            mw_w_property.citation = shared_citation;
            material1.property.push(mw_w_property);
          } else {
            this.logger.debug(`Unable to create molmass1 property`);
          }
          break;
        }
        case 'solvent': {
          await this.assign_solvent_fields(material1, solvents, chi_row.compound1);
          break;
        }
        case 'other': {
          await this.assign_other_fields(material1, others, chi_row.compound1);
          break;
        }
        default:
          this.logger.warning(`type1 == '${chi_row.type1}' is not handled yet.`);
          this.logger.warning(`Skipping row`);
          this.xlsx.chi.parsed_row_count++;
          continue;
      }
      this.validator.validate_or_throw(material1); // To find errors earlier

      this.logger.debug(`Creating Material 2 ...`);
      const material2 = {
        node: ['Material'],
        model_version: '1.0.0',
        name: `PPPDB_${chi_row.id}_${chi_row.compound2}`, // PPPDB_<Column AJ>_<Column F> ,
        names: [] as string[],
        property: [] as IProperty[],
      } satisfies IMaterial;
      if(chi_row.compound2) material2.names.push(chi_row.compound2);// <Column F of chi.csv (string)>
      if(chi_row.ac2) material2.names.push(chi_row.ac2); // <Column H of chi.csv (string)>

      this.logger.debug(`Material 2 is a ${chi_row.type2}`);
      switch(chi_row.type2) {
        case 'polymer':
          this.assign_polymer_fields(material2, polymers, chi_row.compound2);
          const mw_w_property = this.create_mw_w_property(chi_row.molmass2, chi_row.molmassunit);
          if( mw_w_property ) {
            mw_w_property.citation = shared_citation;
            material2.property.push(mw_w_property);
          } else {
            this.logger.debug(`Unable to create molmass2 property`);
          }
          break;

        case 'solvent':
          await this.assign_solvent_fields(material2, solvents, chi_row.compound2);
          break;
        
        case 'other': {
          await this.assign_other_fields(material2, others, chi_row.compound2);
          break;
        }
        default:
          this.logger.warning(`type2 == '${chi_row.type2}' is not handled yet.`);
          this.logger.warning(`Skipping row`);
          this.xlsx.chi.parsed_row_count++;
          continue;
      }
      this.validator.validate_or_throw(material2); // To find errors earlier


      this.logger.debug(`Creating Combined Material ...`);

      const combined_material = {
        node: ['Material'],
        name: `PPPDB_${chi_row.id}_${chi_row.compound1}_${chi_row.compound2}`, // PPPDB_<Column AJ>_<Material1>_<Material2>
        component: [
          material1,
          material2
        ],
        property: [] as Array<IProperty>
      } satisfies IMaterial;

      const method: string | undefined = this.get_method_key_by_name(methods, chi_row.method); // can be undefined, we allow this
      const shared_by_all_properties = {
        notes: `Method: ${chi_row.method}; Notes: ${chi_row.notes ?? 'none'}`,
        method: method,
        condition: [] as ICondition[],
        citation: shared_citation
      } satisfies Pick<IProperty, 'citation' | 'condition' | 'method' | 'notes'>;

      // shared conditions
      {
        // If column X (chimax) is blank
        if( !chi_row.chimax ) {

          // If column P (tempmax) is blank, we can only have a single temperature.
          if( !chi_row.tempmax ) {
            shared_by_all_properties.condition.push({
              node: ['Condition'],
              key: 'temperature',
              type: 'value',
              value: chi_row.temperature,
              unit: chi_row.tempunit
            });

          // Instead, If column P (tempmax) is NOT blank, we have a min/max.
          } else if (chi_row.temperature && chi_row.tempmax) {
            shared_by_all_properties.condition.push({
                node: ['Condition'],
                key: 'temperature',
                type: 'min',
                value: chi_row.temperature, // temperature is considered as min in such case
                unit: chi_row.tempunit
              },
              {
                node: ['Condition'],
                key: 'temperature',
                type: 'max',
                value: chi_row.tempmax,
                unit: chi_row.tempunit
              });
          }
          // If column AK (refvolume) is NOT blank
          if( chi_row.refvolume ) {
            shared_by_all_properties.condition.push({
              node: ['Condition'],
              key: 'reference_volume',
              type: 'value',
              value: chi_row.refvolume,
              unit: chi_row.refvolumeunit
            });
          }
        }
      }

      // Add properties *not* depending on 'type

      const shared_by_all_conc_vol_fraction = {
        citation: shared_citation,
        condition: shared_by_all_properties.condition?.filter( c => c.key !== 'reference_volume')
      }

      if( chi_row.composition1 ) {
        combined_material.property.push({
          node: ['Property'],
          key: 'conc_vol_fraction',
          type: 'value',
          value: chi_row.composition1,
          unit: null,
          component: [material1],
          ...shared_by_all_conc_vol_fraction,
        });
      }

      if( chi_row.composition2 ) {
        combined_material.property.push({
          node: ['Property'],
          key: 'conc_vol_fraction',
          type: 'value',
          value: chi_row.composition2,
          unit: null,
          component: [material2],
          ...shared_by_all_conc_vol_fraction,
        });
      }

      // Add properties depending on 'type'

      // We only handle Type 1 to 3 here. We discard 4 and 5 at the very beginning of the loop.
      switch( chi_row.type ) {
        case "Type 1":
          // If Type 1 and column X is blank
          if( !chi_row.chimax ) {
            const interaction_param = {
              node: ['Property'],
              key: 'interaction_param',
              type: 'value',
              value: chi_row.chinumber,
              uncertainty: chi_row.chierror,
              unit: null,
              ...shared_by_all_properties,
            } satisfies IProperty;
            combined_material.property.push(interaction_param);

          // If Type 1 and column X is *not* blank
          } else if (chi_row.chinumber && chi_row.chimax) {

            // interaction param (min)
            combined_material.property.push({
              node: ['Property'],
              key: 'interaction_param',
              type: 'min',
              value: chi_row.chinumber,
              unit: null,
              ...shared_by_all_properties,
            });

            // interaction param (max)
            combined_material.property.push({
              node: ['Property'],
              key: 'interaction_param',
              type: 'max',
              value: chi_row.chimax,
              unit: null,
              ...shared_by_all_properties,
            });
          }
          break;
        
        case 'Type 3':
          if( chi_row.chic ){
            combined_material.property.push({
              node: ['Property'],
              key: 'interaction_param_c',
              type: 'value',
              value: chi_row.chic,
              uncertainty: chi_row.chicerror,
              unit: 'K**2',
              // unit: undefined, // on purpose
              ...shared_by_all_properties,
            });
          }
          // break; // on purpose, see next case

        case 'Type 2' /* or 'Type 3'*/: 

          if( chi_row.chia ) {
            combined_material.property.push({
              node: ['Property'],
              key: 'interaction_param_a',
              type: 'value',
              value: chi_row.chia,
              uncertainty: chi_row.chiaerror,
              unit: null,
              ...shared_by_all_properties,
            });
          }

          if( chi_row.chib ) {
            combined_material.property.push({
              node: ['Property'],
              key: 'interaction_param_b',
              type: 'value',
              value: chi_row.chib,
              uncertainty: chi_row.chiberror,
              unit: 'K',
              ...shared_by_all_properties,
            });
          }
          break;            
        default:
          const unhandled_type: never = chi_row.type; // compile-time check
          throw new Error(`Unhandled type: '${unhandled_type}'`); // runtime check
      }

      // finally, add the materials.
      // This avoid to add a row partially (see multiple "continue" keywords above)
      this.add_material(material1, material2, combined_material);
      this.xlsx.chi.parsed_row_count++;
      this.logger.info(`Row completed`);
    };
    
    this.logger.prefix = null;
    this.logger.info(`All rows have been parsed. Double-check the log above, might contain errors and/or warnings.`);

    this.logger.info(`=-=-=-=-=-=-=-=-=-==--= REPORT START =-=-=-=-=-=-=-=-=-=-=-=-=-`);
    this.log_set( LogLevel.INFO, this.material.bigsmiles.uniques, `Unique BigSMILES list`);
    const missing_items = [
      this.material.bigsmiles.missing,
      this.molfile.missing,
      this.solvent.missing,
      this.polymer.missing,
      this.method.missing,
      this.reference.doi_title.missing,
    ].reduce( (prev, curr) => prev + curr.size , 0);
    if ( missing_items ) {
      this.log_set( LogLevel.ERROR,      this.material.bigsmiles.missing, `Missing bigsmiles`);
      this.log_set( LogLevel.WARNING,    this.molfile.missing,            `Missing molfile(s)`);
      this.log_set( LogLevel.ERROR,      this.solvent.missing,            `Missing solvent(s)`);
      this.log_set( LogLevel.ERROR,      this.polymer.missing,            `Missing polymer`);
      this.log_set( LogLevel.WARNING,    this.method.missing,             `Missing method(s)`);
      this.log_set( LogLevel.ERROR,      this.other.missing,              `Missing other(s)`);
      this.log_set( LogLevel.INFO,       this.reference.doi_title.missing,`DOI title(s) not found on crossref.org`);
    }
    
    this.logger.info(`=-=-=-=-=-=-=-=-=-==-  SUMMARY -=-=-=-=-=-=-=-=-=-=-=-=-=-`);      
    this.logger.info(`- chi row: ${this.xlsx.chi.skipped_row_count} skipped, ${this.xlsx.chi.parsed_row_count} parsed (${chi.length} total)`);
    this.logger.info(`Missing items:`);
    this.log_count_or_none( LogLevel.WARNING, this.molfile.missing,              '- molfile(s):');
    this.log_count_or_none( LogLevel.ERROR,   this.material.bigsmiles.missing,   '- bigsmiles(s):');
    this.log_count_or_none( LogLevel.ERROR,   this.solvent.missing,              '- solvent(s):');
    this.log_count_or_none( LogLevel.ERROR,   this.polymer.missing,              '- polymer(s):');
    this.log_count_or_none( LogLevel.WARNING, this.method.missing,               '- method(s):');
    this.log_count_or_none( LogLevel.ERROR,   this.other.missing,                '- other(s):');
    this.log_count_or_none( LogLevel.INFO,    this.reference.doi_title.missing,  '- doi title(s) not found on crossref.org:');

    // In this script, when a material is added (addMaterial) we just display a warning instead of throwing an error.
    // This is to simplify the correction process by fixing the whole xlsx file at once instead of doing it line by line.
    // That's why we do a global check here to avoid returning an invalid project.
    if( this.material.name.has_duplicates ) {
      this.logger.error(`Two or more materials share the same name, see logs`);
    }

    // Ensure graph is optimised (using Edge and EdgeUUID instead of full nodes, look at the class to know more)
    const optimized_project = new CriptGraphOptimizer().get_optimized(this.project);

    // Validate the project using DB schema
    this.logger.info(`Project validation ...`);      
    const project_is_valid = this.validator.validate('ProjectPost', optimized_project);      
    this.logger.info(this.validator.errorsAsString());
    if( project_is_valid ) {
      this.logger.info(`Project validation: SUCCEEDED!`);
    } else {
      this.logger.error(`Project validation: FAILED (check logs above)`);
      throw new Error(`The optimized project is NOT valid.`);
    }

    this.logger.info(`=-=-=-=-=-=-=-=-=-==--=- Report End =-=-=-=-=-=-=-=-=-=-=-=-=-`);
    this.logger.info(`PPPDB.loader() DONE`);

    console.log(`Processing DONE!`)
    return optimized_project;
  } // load()

  /**
   * Create a mw_w property
   */
  create_mw_w_property(mw_w_value: number | undefined, mw_w_unit: string | undefined): IProperty | undefined{
    if (mw_w_value) {

      if( !mw_w_unit ) {
        this.logger.warning(`molmass1 is defined but we don't have molmassunit. No unit will be assigned to this Property.`);
      }
     
      // create property
      return {
        node: ['Property'],
        key: 'mw_w',
        type: 'value',
        value: mw_w_value,
        unit: mw_w_unit?.toLowerCase() ?? null, // Celcius => celsius, Kelvin => kelvin, etc..
      };          
    }
  }

  /**
   * Assign 'other' fields to a given material.
   * Very similar to assign-solvent_fields but with different columns
   */
  async assign_other_fields(material: IMaterial, others: Other[], other_name: string) {
    // get 'other'
    const other = this.get_other_by_name(others, other_name);
    if( !other ) {
      this.logger.error(`No 'other' found for '${material.name}', skipping PubChem fetch.\n - Identifiers bigsmiles, inchi, chem_formula, and chemical_id will be undefined.`)
      return false;
    }  
    await this.assign_solvents_or_other_fields(material, other);
    return true;
  }

  /**
   * Assign solvent fields to a given material.
   * Try to get the data from PubChem, if it fails try from the solvents.
   */
  async assign_solvent_fields(material: IMaterial, solvents: Solvent[], solvent_name: string) {
    // get solvent
    const solvent = this.get_solvent_by_name(solvents, solvent_name);
    if( !solvent ) {
      this.logger.error(`No solvent found for '${material.name}', skipping PubChem fetch.\n - Identifiers bigsmiles, inchi, chem_formula, and chemical_id will be undefined.`)
      return false;
    }
    await this.assign_solvents_or_other_fields(material, solvent);
    return true;
  }

  async assign_solvents_or_other_fields(material: IMaterial, solvent_or_other: Solvent | Other) {
    const pubchem_cid = solvent_or_other["PubChem CID"];
    if (!pubchem_cid || pubchem_cid == '') {
      this.logger.warning(`pubchem_cid is expected for the solvent (row: ${solvent_or_other?._row_index} in solvents`);
    } else {
      const pubchem_metadata = await this.fetch_pubchem_by_cid(pubchem_cid);
      material.chemical_id = pubchem_metadata.chemical_id;
      material.chem_formula = pubchem_metadata.chem_formula ?? solvent_or_other["Chem Formula"];
      material.inchi = pubchem_metadata.inchi ?? solvent_or_other.InChI;
      material.bigsmiles = pubchem_metadata.smiles ?? solvent_or_other.SMILES;
    }

    // fallback on user defined values
    if (!material.chem_formula) material.chem_formula == solvent_or_other["Chem Formula"];
    if (!material.inchi) material.inchi = solvent_or_other.InChI;
    if (!material.bigsmiles) material.bigsmiles = solvent_or_other.SMILES;

    // warn user
    this.log_if_property_is_undefined(LogLevel.WARNING, material, 'chemical_id', 'chem_formula', 'inchi', 'bigsmiles');
  }

  /**
   * Assign polymer fields ('bigsmiles' and 'inchi') to a given material
   */
  assign_polymer_fields(material: IMaterial, polymers: Polymer[], polymer_name: string ) {

    const polymer = this.get_polymer_by_name(polymers, polymer_name);

    // Assign inchi
    if(polymer) {
      material.inchi = polymer.InChI;
    } else {
      this.logger.error(`Unable to find a polymer for '${polymer_name}'`);
    }
    this.log_if_property_is_undefined(LogLevel.WARNING, material, 'inchi');

    // Assign bigsmiles
    const bigsmiles_from_molfile = this.try_to_generate_bigsmiles_from_molfile(polymer_name);
    if( bigsmiles_from_molfile ) {
      material.bigsmiles = bigsmiles_from_molfile;
    } else if(polymer && polymer.BigSMILES && polymer.BigSMILES != '') {
      this.logger.info(`✅ Take user defined 'BigSMILES': '${polymer.BigSMILES}'`);
      material.bigsmiles = polymer.BigSMILES;      
    } else {
      this.logger.error(`Unable to get a BigSMILES (molfile conversion failed, no BigSMILES value in polymer table). 'bigsmiles' will be undefined.`);
      this.material.bigsmiles.missing.add(material.name)
    }
    if (material.bigsmiles) {
      if ( !this.material.bigsmiles.uniques.has(material.bigsmiles)) {
        this.logger.info(`First time we see this BigSMILES: '${material.bigsmiles}' (${polymer_name})`)
        this.material.bigsmiles.uniques.add(material.bigsmiles);
      } else {
        this.logger.debug(`Bigsmiles already present in unique set: '${material.bigsmiles}'`)
      }
    }
    this.log_if_property_is_undefined(LogLevel.WARNING, material, 'bigsmiles');
  }

  log_if_property_is_undefined(level: LogLevel, material: IMaterial, ...property_name: (keyof IMaterial)[] ): void {
    property_name.forEach( key => {
      if( !material[key] ) {
        this.logger._log(level, `Material ${material.name} has no '${key}'`)
      }
    });
  }

  log_count_or_none(level: LogLevel, items: Set<string>, label: string) {
    const has_items = items.size > 0;
    const prettyCount = has_items ? items.size.toString() : 'None';
    this.logger._log(has_items ? level : LogLevel.INFO, `${label.padEnd(50, '.')} ${prettyCount.padStart(5)}`);
  }

  log_set(level: LogLevel, items: Set<string | undefined>, label: string) {
    if( items.size > 0 ) {
      const items_as_multiline_string = [...items.values()].filter( v => v !== undefined)
        .map( (v, i) => `${(i+1).toString().padStart(3)} - '${v}'`) // "<one-based-index> - <value>" like message
        .join('\n');
      this.logger._log(level, `${label} (${items.size} item(s)):\n${items_as_multiline_string}`);
    }
  }
  
  get_method_key_by_name(methods: Method[], method_name: string): string | undefined {

    if( method_name.toLowerCase() === 'not specified') {
        // Usually the user put 'Not Specified' when there is no known method, it imply there is no method either.
        // we report just in case.
        this.logger.info(`Skipping 'Method' == '${method_name}'`)
        return undefined;
    }

    const method_key_column = 'Method with key' as const;
    const method_name_column = 'Method' as const;

    // Find corresponding method, if we do not find it we report it as an error (it is unexpected).
    const method = methods.find( m => m[method_name_column] === method_name);
    if ( !method ) {
      this.method.missing.add(method_name);
      this.logger.error(`No method found for '${method_name_column}' == '${method_name}'`);
      return undefined;
    } 

    // Get the corresponding key, not having a key is not an error (it is expected for certain cells).
    // But we inform the user via a warning in such case.    
    const method_key = method?.[method_key_column];
    if( !method_key ) this.logger.info(`No '${method_key_column}' found for '${method_name_column}' = '${method_name}'`);
    return method_key;
  }

  get_other_by_name(others: Other[], name: string): Other | undefined {
    const name_column_key = 'compound1';
    const result = others.find( other => other[name_column_key] === name )
    if ( !result ) {
      this.other.missing.add(name);
      this.logger.error(`Unable to find an 'other' with '${name_column_key}' == '${name}'`);
    }
    return result;
  }

  get_solvent_by_name(solvents: Solvent[], name: string): Solvent | undefined {
    const name_column_key = "name of solvent (new)";
    const result = solvents.find( solvent => solvent[name_column_key] === name )
    if ( !result ) {
      this.solvent.missing.add(name);
      this.logger.error(`Unable to find a 'solvent' with '${name_column_key}' == '${name}'`);
    }
    return result;
  }

  get_polymer_by_name(polymers: Polymer[], name: string): Polymer | undefined {
    const name_column_key = "Name (new)";
    const result = polymers.find( polymer => polymer[name_column_key] === name );
    if ( !result ) {
      this.polymer.missing.add(name);
      this.logger.error(`Unable to find a 'polymer' with '${name_column_key}' == '${name}'`);
    }
    return result;
  }

  /**
   * Generate a bigsmiles from a given compound name.
   * Internaly, the name is normalized and used to lookup in all
   * known (indexed) molfiles.
   * If the file is found, we use @cript-web/bigsmiles-toolkit to convert it to bigsmiles.
   */
  try_to_generate_bigsmiles_from_molfile(compound_name: string) {
    const molfile_clean_name = this.compute_normalized_molfile_clean_name(compound_name);
    const molfile_path = this.molfile.name_to_path.get(molfile_clean_name);
    let molfile_string: string | undefined;
    let result: string | undefined;

    if( molfile_clean_name === 'poly(ethylene-r-butylene).mol') {
      // hard-coded case. The library @cript-web/bigsmiles-toolkit throws an exception while converting it (using both v2000 and v3000)
      result = '{[][$]CC[$],[$]CC(CC)[$][]}';
      this.logger.info(`Applied an hard-coded bigsmiles for '${molfile_clean_name}': ${result}`)
    } else if ( !molfile_path) {
      this.logger.warning(`No molfile found for index: '${molfile_clean_name}'`);
      this.molfile.missing.add(molfile_clean_name);
    } else if( fs.existsSync(molfile_path) ) {
      try {
        const molfile_descriptor = fs.openSync(molfile_path, 'r');
        molfile_string = fs.readFileSync(molfile_descriptor).toString();            
      } catch ( err: any ) {
        this.logger.error(`Unable to load the mol file ${molfile_path}.\n${err.stack}`);
      }        
      if( molfile_string ) {
        try {
          result = molfile_to_bigsmiles(molfile_string); 
        } catch( err: any ) {
          this.logger.warning(`Unable to convert the mol file ${molfile_path}.\n${err.stack}`);
        }
      }
    } else {
      this.logger.error(`Molfile exists in index but is not found: ${molfile_path}`);
    }
    return result;
  }

  /**
   * Ensure name is space free, lower case and contains the *.mol extension
   */
  compute_normalized_molfile_clean_name(name: string): string {
    const clean_file_name = name
      .replaceAll(' ', '')
      .replaceAll('ε-', '')
      .toLowerCase();

    if( !clean_file_name.endsWith('.mol') )
      return clean_file_name + '.mol';
    return clean_file_name;
  }

  /**
   * Create Citation nodes from a given ChiData (a row as JSON)
   */
  private async create_citations(chiRow: Chi): Promise<ICitation[] | undefined> {

    const references: Array<Partial<IReference>> = [];

    //
    // Strategy:
    // - get 'doi' column as first citation (the most important)
    // - append any 'reference' (0 to N)
    //
    // note: There is 1 reference per citation.
    //

    if(chiRow.doi){
      const ref = await this.create_reference(chiRow.doi);
      if(ref) {
        this.logger.debug(`Push reference: ${ref.title}`);
        references.push(ref)
      } else {
        this.logger.warning(`Unable to create a Reference Node from 'doi': '${chiRow.doi}'`)
      }
    } else {
      this.logger.warning(`No value in for 'doi' column`);
    }

    if (chiRow.reference) {

      if( chiRow.reference.trim() === 'Ciation: Zaborski, M.; Kosmalska, A. Kautsch. Gummi Kunstst. 2005, 58, 354– 357.' ) {
        //
        // Hard-coded specific case
        // 
        // context:
        // "
        //   I think there is only one. [cell] AH84. The problem is that this particular one does not have a DOI.
        //   Also it is German so very hard for me to figure out details. Can we just hard code the information
        //   for this one example? The title, ISSN, etc. are available here:
        //   https://www.webofscience.com/wos/woscc/full-record/WOS:000231441700001
        // "
        const ref: IReference = {
          node: ['Reference'],
          title: 'Silica modified by use of organosilanes as a filler for carboxylated butadiene-acrylonitrile rubber',
          issn: '0948-3276',
          type: 'journal_article'
        };
        references.push(ref)
        this.logger.debug(`Push reference: ${ref.title}`);
        this.logger.info(`Apply hard-coded case for '${chiRow.reference}'`);
  
      } else {
        const refs = chiRow.reference.split('; '); // some references includes a ";" without space
        for( const [index, ref] of refs.entries()) {
          const referenceNode = await this.create_reference(ref);
          if( referenceNode ) {
            this.logger.debug(`Push reference 'reference[${index}]': ${referenceNode.title}`);
            references.push(referenceNode)
          } else {
            this.logger.error(`Unable to create a Reference node for 'reference[${index}]': '${ref}'`)
          }
        }
      }
    }

    if(references.length === 0) {
      this.logger.error(`Unable to create any Reference Node, check 'doi' and 'reference' columns.`);
      return undefined;
    }

    // Wrap each reference in a citation node
    const citations: ICitation[] =  references
      .map( each_reference => ({
        node: ['Citation'],
        type: 'extracted_by_human',
        reference: each_reference as IReference
      } satisfies ICitation));
    this.logger.debug(`Created ${citations.length} Citation Node(s)`);

    return citations;
  }

  async create_reference(doi_issn_isbn_or_string: string) {
    let reference: Required<Pick<IReference, 'node' | 'title' | 'type'>> & Partial<IReference> | undefined;

    let clean_input = doi_issn_isbn_or_string
                                            .toLowerCase()
                                            .replaceAll(' ', '')
                                            .trim();
    if(!clean_input) {
      throw new Error(`doi_issn_isbn_or_string is null or undefined`);
    }
    if(clean_input === '') {
      throw new Error(`doi_issn_isbn_or_string is empty`);
    }

    // Get from the cache
    const cached_reference = this.reference.by_name.get(clean_input);
    if(cached_reference) {
      return cached_reference;
    }
    
    if (clean_input.startsWith('isbn:')) {
      const isbn = clean_input.substring(5).trim();
      reference = {
        node: ['Reference'],
        title: isbn, // we couln't get ISBN's title from api.crossref.org
        isbn,
        type: 'book'
      }      
    } else if ( doi_issn_isbn_or_string.startsWith('Citation:') ) { // specific hard-coded case
      const title = doi_issn_isbn_or_string.substring(9).trim();
      reference = {
        node: ['Reference'],
        title,
        type: 'thesis'
      }
    } else {
      if ( clean_input.startsWith('doi:')) {
        clean_input = clean_input.substring(4).trim();
      } 
      let title = await this.fetch_doi_title_from_crossref_api(clean_input);
      if(!title) {
        const default_title = doi_issn_isbn_or_string;
        this.logger.info(`Using default value for reference's title: '${default_title}'`)
        title = default_title; // use user input for title when we cannot get it from crossref
      }
      reference = {        
        node: ['Reference'],
        title,
        doi: clean_input,
        type: 'journal_article'
      }
    }

    // Add to the cache if necessary
    if( !this.reference.by_name.has(clean_input) ) {
      this.reference.by_name.set(clean_input, reference);
    }

    return reference;
  }

  /**
   * Fetch DOI's title from api.crossref.org
   * @param doi must be a doi string without doi prefix ("doi:")
   */
  async fetch_doi_title_from_crossref_api(doi: string): Promise<string | undefined> {
    let title: string | undefined;
    const url = encodeURI(`https://api.crossref.org/works/${doi}`);
    try {
      // reference: https://www.crossref.org/documentation/retrieve-metadata/rest-api/a-non-technical-introduction-to-our-api/
      const response = await fetch(url);
      if( response.ok ) {
        const data = await response.json();
        title = data.message.title?.at(0);
        this.logger.debug(`DOI's title found on crossref.org (doi: ${doi}, url: ${url}): ${title}`);
      } else {
        this.logger.info(`DOI's title NOT found on crossref.org.\n doi: ${doi}\n url: ${url}\n response: ${await response.text()}`);
      }
    } catch (err: any) {
      this.logger.error(`Unable to fetch api.crossref.org.\n doi: ${doi}\n url: ${url}\n${err.stack}`);
    }
    if(!title) {
      this.reference.doi_title.missing.add(doi);
    }
    return title;
  }

  /**
   * Loads the first sheet of a given *.xslx file
   * 
   * User has to know in advance the type of the expected JSON,
   * No check is done prior to return the data. In case you want to ensure the data has the right type
   * you must not set T to unknown and write discrimination tests.
   */
  private load_first_sheet_from_xlsx<T extends { _row_index: number }>(
    file_path: string,
    options: XLSX.ParsingOptions & { index_offset: number } = { index_offset: 0 } ) {

    // Load the XLSX file
    this.logger.info(`Reading ${file_path} ...`);
    const workBook = XLSX.readFile(file_path, options);

    // Pick the first sheetName
    const sheetName = workBook.SheetNames.at(0);
    if( !sheetName ) throw new Error(`Unable to find any sheets in ${file_path}`)

    // Loading the sheet
    this.logger.debug(`Getting '${sheetName}' WorkSheet ...`);
    const workSheet: XLSX.WorkSheet = workBook.Sheets[sheetName] ?? [];
  
    // Convert to objects
    //   Note: We'll loose in performance and memory usage by doing this, but our dataset is very small.
    //         We prefer here to deal with objects instead of defining a Column enum like we did for rcbc project (the result was not well readable).
    this.logger.debug(`Converting WorkSheet to JSON ...`);
    const result = XLSX.utils.sheet_to_json<T>(workSheet);
    // store the row index to help debugging.
    result.forEach( (each, index) => each._row_index = options.index_offset + index + 1 ); // +1 because excell sheets are 1-based.

    this.logger.info(`Found ${result.length} row(s)`);
    this.logger.debug(`Here is a sample of the first row:\n ${JSON.stringify(result.slice(undefined, 1), null, '\t')}`);

    return result;
  }

 /**
 * Add one or more material to the project
 * 
 * It also checks if the material's name are unique.
 * In case the name is in use, a log is emitted.
 */
  private add_material(...materials: IMaterial[]) {
    for( const material of materials) {
      if( !material ) throw new Error('material is undefined');
      
      if(this.material.unique_name.has(material.name)) {
        this.logger.error(`This material name is already in use: '${material.name}'`);
        this.material.name.has_duplicates = true;
      } else {
        this.material.unique_name.add(material.name);
      }
      this.project.material.push(material);
    }
    this.log_set(LogLevel.DEBUG, new Set(materials.map( m => m.name) ), 'Adding material(s) to the project');
  }

  /**
   * Fetch some metadata from PubChem using a given cid
   */
  async fetch_pubchem_by_cid(cid: string): Promise<{
    chem_formula?: string;
    chemical_id?: string;
    inchi?: string;
    smiles?: string;
  } > {

    let result: {
      chem_formula?: string;
      inchi?: string;
      smiles?: string;
      chemical_id?: string;
    } = {};

    // First get the properties using the "/property" method
    try {     
      // See the API reference here: https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest#section=Compound-Property-Tables
      const prop_names = ['InChI', 'InChIKey', 'MolecularFormula', 'CanonicalSMILES'];
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/${prop_names.join(',')}/JSON`;
      const response = await fetch(url);
      if( response.ok ) {
        const data: PubChemPropertyResponse = await response.json(); // Take in consideration we do not check the conversion from "any" to "PubChemResponse"
        const properties = data.PropertyTable.Properties[0];        
        result = {
          inchi: properties.InChI,
          smiles: properties.CanonicalSMILES,
          chem_formula: properties.MolecularFormula,
        }
      } else {
        this.logger.error(`PubChem's fetch FAILED.\n Url: ${url}\n Response: ${await response.text()}`);
      }
    } catch (err: any) {
      this.logger.error(`PubChem's fetch FAILED.\n${err.stack}`);
    }

    // Then, get the CAS from a different endpoint.
    // Note: we couldn't get the CAS using the first method, this method returns a much more complicated JSON,
    //       that's why we prefered the first method for the 3 other fields.
    try {
      // @see https://pubchem.ncbi.nlm.nih.gov/docs/pug-view#section=Specific-Heading
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=CAS`;
      const response = await fetch(url);
      if( response.ok ) {
        const data: PubChemCASResponse = await response.json();
        // Since we searched for a known heading, we should have the expected result in the first sections
        const chemical_id_or_undefined = data.Record.Section.at(0)?.Section.at(0)?.Section.at(0)?.Information.at(0)?.Value.StringWithMarkup.at(0)?.String;
        if ( chemical_id_or_undefined ) {
          result.chemical_id = chemical_id_or_undefined;
        } else {
          this.logger.error(`Unable to find the CAS from PubChem's response.\n Url: ${url}\n Response: ${await response.text()}`);
        }
      } else {
        this.logger.error(`PubChem's fetch FAILED.\n Url: ${url}\n Response: ${await response.text()}`);
      }
    } catch (err: any) {
      this.logger.error(`PubChem's fetch FAILED.\n${err.stack}`);
    }

    return result;
  }
} // namespace PPPDBLoader

