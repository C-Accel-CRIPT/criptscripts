/**
 * The purpose of this script is to load chi.xlsx file and export it as a JSON file.
 * The script also loads the content of method.xlsx, polymers.xlsx, and solvent.xlsx.
 *
 * Documentation reference on XSLX: https://docs.sheetjs.com/docs

 */
import * as XLSX from "xlsx";
import { EdgeUUID, ICitation, ICollection, ICondition, IMaterial, IProject, IProperty, IReference } from "@cript";
import { Chi, Method, PubChemCASResponse, PubChemPropertyResponse, Solvent } from "./types";
import { CriptValidator, Logger, LogLevel, LoggerOptions, CriptGraph } from "@utilities";
import { Other } from "./types/sheets/others";
import { fetch } from "cross-fetch";
import make_edge = CriptGraph.make_edge_uuid;

export type PPPDBJSON = {
  // Nodes that must be uploaded prior to the project
  shared: {
    reference: IReference[]
  },
  project: IProject
}

export class PPPDBLoader {

  readonly logger: Logger;
  private project = this.createProject();
  private validator = new CriptValidator();

  private reference = {
    by_identifier: new Map<string, IReference>(),
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
      uuid: CriptGraph.make_uuid(),
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
    };
    row_limit: number;
  }): Promise<PPPDBJSON> {
    this.logger.prefix = null;
    this.logger.info(`PPPDB.load() ...`);
    this.logger.debug(`Reset state`);

    // clear state
    this.project = this.createProject();
    this.reference.by_identifier.clear();
    this.reference.doi_title.missing.clear();
    this.material.name.has_duplicates = false;
    this.material.bigsmiles.missing.clear();
    this.material.bigsmiles.uniques.clear();
    this.material.unique_name.clear();
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
     * - Create Materials 1 and 2 (depending on their type 'polymer' or 'solvent')
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
    const solvents = this.load_first_sheet_from_xlsx<Solvent>(options.paths.solvents, parsing_options);
    const others = this.load_first_sheet_from_xlsx<Other>(options.paths.others, parsing_options);

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

      // Skip rows with types we do not handle (10/26/2023)
      switch( chi_row.type ) {
        case 'Type 1':
        case 'Type 2':
        case "Type 3":
          // We handle those types
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
        uid: CriptGraph.make_uid(),
        node: ['Material'],
        model_version: '1.0.0',
        name: `PPPDB_${chi_row.id}_${chi_row.compound1}`,
        names: [] as string[],
        property: [] as IProperty[],
        bigsmiles: chi_row.BigSMILES1,
      } satisfies IMaterial;

      if(chi_row.compound1) material1.names.push(chi_row.compound1);
      if(chi_row.ac1) material1.names.push(chi_row.ac1);


      this.logger.debug(`Material 1 is a ${chi_row.type1}`);
      switch( chi_row.type1 ) {
        case 'polymer': {
          const mw_w_property = this.create_mw_w_property(chi_row.molmass1, chi_row.molmassunit);
          if( mw_w_property ) {
            mw_w_property.citation = shared_citation;
            this.validate_and_push_property( material1, mw_w_property);
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
        uid: CriptGraph.make_uid(),
        node: ['Material'],
        model_version: '1.0.0',
        name: `PPPDB_${chi_row.id}_${chi_row.compound2}`,
        names: [] as string[],
        property: [] as IProperty[],
        bigsmiles: chi_row.BigSMILES2,
      } satisfies IMaterial;
      if(chi_row.compound2) material2.names.push(chi_row.compound2);
      if(chi_row.ac2) material2.names.push(chi_row.ac2);

      this.logger.debug(`Material 2 is a ${chi_row.type2}`);
      switch(chi_row.type2) {
        case 'polymer':
          const mw_w_property = this.create_mw_w_property(chi_row.molmass2, chi_row.molmassunit);
          if( mw_w_property ) {
            mw_w_property.citation = shared_citation;
            this.validate_and_push_property( material2, mw_w_property);
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
        uid: CriptGraph.make_uid(),
        node: ['Material'],
        name: `PPPDB_${chi_row.id}_${chi_row.compound1}_${chi_row.compound2}`,
        component: [material1, material2].map( CriptGraph.make_edge_uid ), // we use UID because materials will be uploaded together
        property: [] as Array<IProperty>
      } satisfies IMaterial;

      const method: string | undefined = this.get_method_key_by_name(methods, chi_row.method); // can be undefined, we allow this
      const shared_by_all_properties = {
        notes: `Method: ${chi_row.method}; Notes: ${chi_row.notes ?? 'none'}`,
        method: method,
        condition: [] as ICondition[],
        citation: shared_citation,
      } as const;

      // shared conditions
      {
        if( !chi_row.chimax ) {

          // single temperature value
          if( !chi_row.tempmax ) {
            this.validate_and_push_condition( shared_by_all_properties, {
              node: ['Condition'],
              key: 'temperature',
              type: 'value',
              value: chi_row.temperature,
              unit: chi_row.tempunit
            });

          // min/max temperature values
          } else if ( chi_row.temperature ) {
            this.validate_and_push_condition( shared_by_all_properties, {
                node: ['Condition'],
                key: 'temperature',
                type: 'min',
                value: chi_row.temperature, // temperature is considered as min in such case
                unit: chi_row.tempunit
              });
            this.validate_and_push_condition( shared_by_all_properties, {              
                node: ['Condition'],
                key: 'temperature',
                type: 'max',
                value: chi_row.tempmax,
                unit: chi_row.tempunit
              });
          }

          if( chi_row.refvolume ) {
            this.validate_and_push_condition( shared_by_all_properties, {
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
        this.validate_and_push_property( combined_material, {
          node: ['Property'],
          key: 'conc_vol_fraction',
          type: 'value',
          value: chi_row.composition1,
          unit: null,
          component: [ CriptGraph.make_edge_uid(material1) ],
          ...shared_by_all_conc_vol_fraction,
        });
      }

      if( chi_row.composition2 ) {
        this.validate_and_push_property( combined_material, {
          node: ['Property'],
          key: 'conc_vol_fraction',
          type: 'value',
          value: chi_row.composition2,
          unit: null,
          component: [ CriptGraph.make_edge_uid(material2) ],
          ...shared_by_all_conc_vol_fraction,
        });
      }

      // Add properties depending on 'type'

      // We only handle Type 1 to 3 here. We discard 4 and 5 at the very beginning of the loop.
      switch( chi_row.type ) {
        case "Type 1":

          if( !chi_row.chimax ) {
           
            this.validate_and_push_property(combined_material, {
              node: ['Property'],
              key: 'interaction_param',
              type: 'value',
              value: chi_row.chinumber,
              uncertainty: chi_row.chierror,
              unit: null,
              ...shared_by_all_properties,
            } satisfies IProperty);

          } else if (chi_row.chinumber && chi_row.chimax) {

            // interaction param (min)
            this.validate_and_push_property( combined_material, {
              node: ['Property'],
              key: 'interaction_param',
              type: 'min',
              value: chi_row.chinumber,
              unit: null,
              ...shared_by_all_properties,
            });

            // interaction param (max)
            this.validate_and_push_property( combined_material, {
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
            this.validate_and_push_property( combined_material, {
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
            this.validate_and_push_property( combined_material, {
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
            this.validate_and_push_property( combined_material, {
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

      // Finally, add both materials at once.
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
      this.solvent.missing,
      this.method.missing,
      this.reference.doi_title.missing,
    ].reduce( (prev, curr) => prev + curr.size , 0);
    if ( missing_items ) {
      this.log_set( LogLevel.ERROR,      this.material.bigsmiles.missing, `Missing bigsmiles`);
      this.log_set( LogLevel.ERROR,      this.solvent.missing,            `Missing solvent(s)`);
      this.log_set( LogLevel.WARNING,    this.method.missing,             `Missing method(s)`);
      this.log_set( LogLevel.ERROR,      this.other.missing,              `Missing other(s)`);
      this.log_set( LogLevel.INFO,       this.reference.doi_title.missing,`DOI title(s) not found on crossref.org`);
    }
    
    this.logger.info(`=-=-=-=-=-=-=-=-=-==-  SUMMARY -=-=-=-=-=-=-=-=-=-=-=-=-=-`);      
    this.logger.info(`- chi row: ${this.xlsx.chi.skipped_row_count} skipped, ${this.xlsx.chi.parsed_row_count} parsed (${chi.length} total)`);
    this.logger.info(`Missing items:`);
    this.log_count_or_none( LogLevel.ERROR,   this.material.bigsmiles.missing,   '- bigsmiles(s):');
    this.log_count_or_none( LogLevel.ERROR,   this.solvent.missing,              '- solvent(s):');
    this.log_count_or_none( LogLevel.WARNING, this.method.missing,               '- method(s):');
    this.log_count_or_none( LogLevel.ERROR,   this.other.missing,                '- other(s):');
    this.log_count_or_none( LogLevel.INFO,    this.reference.doi_title.missing,  '- doi title(s) not found on crossref.org:');

    // In this script, when a material is added (addMaterial) we just display a warning instead of throwing an error.
    // This is to simplify the correction process by fixing the whole xlsx file at once instead of doing it line by line.
    // That's why we do a global check here to avoid returning an invalid project.
    if( this.material.name.has_duplicates ) {
      this.logger.error(`Two or more materials share the same name, see logs`);
    }

    // Optimize the graph
    const result: PPPDBJSON = {
      shared: {
        reference: Array.from(this.reference.by_identifier.values())
      },
      project: CriptGraph.optimize_project(this.project, 'make-edge-uid')
    };

    // Validate the project using DB schema
    this.logger.info(`Project validation ...`);      
    const project_is_valid = this.validator.validate('ProjectPost', result.project);
    if( project_is_valid ) {
      this.logger.info(`Project validation: SUCCEEDED!`);
    } else {
      this.logger.error(this.validator.errorsAsString(1));
      this.logger.error(`Project validation: FAILED (check logs above)`);

      console.log(this.validator.errorsAsString(1));
      console.log(`Project validation: FAILED`)
    }

    this.logger.info(`=-=-=-=-=-=-=-=-=-==--=- Report End =-=-=-=-=-=-=-=-=-=-=-=-=-`);
    this.logger.info(`PPPDB.loader() DONE`);

    console.log(`Processing DONE!`)
    return result;
  } // load()

  /**
   * Validate (or throw) a property and push it to the materials' property array.
   */
  validate_and_push_condition(node_with_condition: { condition: ICondition[]}, condition: ICondition) {
    this.validator.validate_or_throw(condition);
    node_with_condition.condition.push(condition);
  }

  /**
   * Validate (or throw) a property and push it to the materials' property array.
   */
  validate_and_push_property(node_with_property: { property: IProperty[] }, property: IProperty): void | never {
    this.validator.validate_or_throw(property);
    node_with_property.property.push(property);
  }

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
      this.logger.warning(`pubchem_cid is expected for the solvent or other: ${JSON.stringify(solvent_or_other)}`);
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

  /**
   * Create Citation nodes from a given ChiData (a row as JSON)
   */
  private async create_citations(chiRow: Chi): Promise<ICitation[] | undefined> {

    const references: Array<Partial<IReference>> = [];

    //
    // Strategy:
    // - get 'doi' as first citation (the most important)
    // - append any 'reference' (0 to N)
    //
    // note: There is 1 reference per citation.
    //

    if(chiRow.doi){
      const ref = await this.get_reference(chiRow.doi);
      if(ref) {
        this.logger.debug(`Push reference (as ${CriptGraph.is_edge_uid(ref) ? 'EdgeUUID' : 'Reference'}): uuid:${ref.uuid}`);
        references.push(ref)
      } else {
        this.logger.warning(`Unable to create a Reference Node from 'doi': '${chiRow.doi}'`)
      }
    } else {
      this.logger.warning(`No value in for 'doi' column`);
    }

    if (chiRow.reference) {
      // Spacial case
      if( chiRow.reference.trim() === 'Citation: Zaborski, M.; Kosmalska, A. Kautsch. Gummi Kunstst. 2005, 58, 354– 357.' ) {
        const ref = await this.get_reference(chiRow.reference);
        references.push(ref);
      } else {
          const refs = chiRow.reference.split('; '); // some references include a ";" without space
          for( const [index, reference_string] of refs.entries()) {
            const ref = await this.get_reference(reference_string);
            if( ref ) {
              this.logger.debug(`Push reference (as ${CriptGraph.is_edge_uid(ref) ? 'EdgeUUID' : 'Reference'}): uuid:${ref.uuid}`);
              references.push(ref)
            } else {
              this.logger.error(`Unable to create a Reference node for 'reference[${index}]': '${reference_string}'`)
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
        // uuid: CriptGraph.make_uuid(), Citation should not be shared.
        node: ['Citation'],
        type: 'extracted_by_human',
        reference: make_edge(each_reference),
      } satisfies ICitation));
    this.logger.debug(`Created ${citations.length} Citation Node(s)`);
    return citations;
  }

  async get_reference(doi_issn_isbn_or_string: string): Promise<EdgeUUID> {
    let reference: Required<Pick<IReference, 'uuid' | 'node' | 'title' | 'type'>> & Partial<IReference> | undefined;

    const clean = ( str: string ) => {
      return str
        .toLowerCase()
        .replaceAll(' ', '');
    }
    let clean_value = clean( doi_issn_isbn_or_string );
    if(!clean_value) throw new Error(`doi_issn_isbn_or_string is null or undefined`);
    if(clean_value === '')  throw new Error(`doi_issn_isbn_or_string is empty`);

    // Hard-coded specific case
    if( clean_value === clean('Citation: Zaborski, M.; Kosmalska, A. Kautsch. Gummi Kunstst. 2005, 58, 354– 357.') ) {
      // context:
      // "
      //   I think there is only one. [cell] AH84. The problem is that this particular one does not have a DOI.
      //   Also it is German so very hard for me to figure out details. Can we just hard code the information
      //   for this one example? The title, ISSN, etc. are available here:
      //   https://www.webofscience.com/wos/woscc/full-record/WOS:000231441700001
      // "
      reference = {
        uuid: CriptGraph.make_uuid(),
        node: ['Reference'],
        title: 'Silica modified by use of organosilanes as a filler for carboxylated butadiene-acrylonitrile rubber',
        issn: '0948-3276',
        type: 'journal_article'
      };
      this.logger.info(`Apply hard-coded case for '${clean_value}'`);
    } else if (clean_value.startsWith('isbn:')) {
      const isbn = clean_value.substring(5).trim();
      reference = {
        uuid: CriptGraph.make_uuid(),
        node: ['Reference'],
        title: isbn, // we couldn't get ISBN title from https://api.crossref.org
        isbn,
        type: 'book'
      }      
    } else if ( doi_issn_isbn_or_string.startsWith('Citation:') ) { // specific hard-coded case
      const title = doi_issn_isbn_or_string.substring(9);
      reference = {
        uuid: CriptGraph.make_uuid(),
        node: ['Reference'],
        title,
        type: 'thesis'
      }
    } else {
      let doi = clean_value.startsWith('doi:') ? clean_value.substring(4) : clean_value;
      let title = await this.fetch_doi_title_from_crossref_api(doi);
      if (!title) {
        const default_title = doi_issn_isbn_or_string;
        this.logger.info(`Using default value for reference's title: '${default_title}'`)
        title = default_title; // use user input for title when we cannot get it from https://api.crossref.org
      }
      reference = {
        uuid: CriptGraph.make_uuid(),
        node: ['Reference'],
        title,
        doi,
        type: 'journal_article'
      }
    }

    // Check if reference already exists
    // - Generate a unique identifier for the reference
    // - If exists: use existing as EdgeUUID
    // - Otherwise: add to cache and return as EdgeUUID
    let identifier = reference.doi ?? reference.issn ?? reference.isbn ?? reference.title;
    if( identifier === undefined) throw new Error("Unable to determine Reference's identifier", { cause: reference })
    const existing = this.reference.by_identifier.get(identifier);
    if( existing ) {
      return CriptGraph.make_edge_uuid(existing)
    }
    this.reference.by_identifier.set( identifier, reference )
    return CriptGraph.make_edge_uuid(reference);
  }

  /**
   * Fetch DOI title from  https://api.crossref.org
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
    //   Note: We'll lose in performance and memory usage by doing this, but our dataset is very small.
    //         We prefer here to deal with objects instead of defining a Column enum like we did for RCBC project (the result was not well readable).
    this.logger.debug(`Converting WorkSheet to JSON ...`);
    const result = XLSX.utils.sheet_to_json<T>(workSheet);
    // store the row index to help debugging.
    result.forEach( (each, index) => each._row_index = options.index_offset + index + 1 ); // +1 because Excel sheets are 1-based.

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
    //       that's why we preferred the first method for the 3 other fields.
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
} // class PPPDBLoader

