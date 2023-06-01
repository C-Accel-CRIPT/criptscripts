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
import { ProjectValidator, Logger, LogLevel, LoggerOptions } from "@utilities";
import { Writable } from "stream";

export class PPPDBLoader {

  private project = {
    name: "PPPDB",
    model_version: "1.0.0",
    node: ["Project"],
    collection: new Array<ICollection>(),
    material: new Array<IMaterial>(),
  } satisfies IProject;

  /** Helper to ensure we have unique names */
  private material_unique_names = new Set<string>();
  /** Flag to mark when two materials with the same name have been added to the project */
  private has_materials_with_non_unique_names: boolean = false;
  /**
   * Map each molfile name (lower-case, trimmed, no extension) to its molfile path.
   * The key should match potentially with the compound1 column.
   * "poly(developer)" => "C:/path/to/the/molfiles/folder/Poly(developer) .mol"
   */
  private molfile_name_to_path = new Map<string, string>();
  /** Store missing files/names to display a general report */
  private missing = {
    molfile: new Set<string>(),
    polymer: new Set<string>(),
    solvent: new Set<string>(),
    method: new Set<string>(),
  };
  
  readonly logger: Logger;

  constructor(options: { logger: LoggerOptions }) {
    this.logger = new Logger(options.logger)
  }

  /**
   * Loads a given set of PPPDB files and converts it to a CRIPT Project
   */
  async load(options: {
    paths: {
      chi: string,
      methods: string,
      polymers: string,
      solvents: string,
      molfile_dir: string,
    };
    limitSheetRows: number;
  }): Promise<IProject> {
    this.logger.prefix = null;
    this.logger.message(`PPPDB.load() ...`);
    this.logger.debug(`Reset state`);
    this.molfile_name_to_path.clear();
    this.missing.method.clear();
    this.missing.molfile.clear();
    this.missing.polymer.clear();
    this.missing.solvent.clear();
    this.material_unique_names.clear();
    this.has_materials_with_non_unique_names = false;
    
    /**
     * Global Strategy:
     * ----------------
     * 
     * - Create Materials 1 and 2 (depending of their type 'polymer' or 'solvent')
     *  - add Chi Property with a Citation/Reference
     *  - add bigsmiles identifier by converting molfiles
     * - Create a Material Combined (having Material 1 & 2 as component)
     *  - add X property with a Citation/Reference and a set of Conditions
     */

    const parsingOptions = {
      sheetRows: options.limitSheetRows,
      cellHTML: false,
      cellFormula: false,
    };

    this.logger.message(`Loading *.xslx files ...`);
    const chi = this.loadFirstSheet<Chi>(options.paths.chi, parsingOptions);
    const methods = this.loadFirstSheet<Method>(options.paths.methods, parsingOptions);
    const polymers = this.loadFirstSheet<Polymer>(options.paths.polymers, parsingOptions);
    const solvents = this.loadFirstSheet<Solvent>(options.paths.solvents, parsingOptions);

    this.logger.message(`Indexing molfiles from '${options.paths.molfile_dir}' ...`);
    try {      
      const file_names = fs.readdirSync(options.paths.molfile_dir);
      for(const file_name of file_names) {
        const clean_file_name = this.computeMolfileCleanName(file_name);
        const absolute_file_path = resolve(options.paths.molfile_dir, file_name);
        this.molfile_name_to_path.set(clean_file_name, absolute_file_path);
        this.logger.message(` Add entry: ${ ("'" + clean_file_name + "'").padEnd(40)} => '${absolute_file_path}'`);
      }
    } catch( e ) {
      throw new Error(`Unable to index molfiles. Reason: ${JSON.stringify(e)}`)
    }
    this.logger.message(`Indexing molfiles DONE (found ${this.molfile_name_to_path.size} files)`);
    
    for( const chiRow of chi) {
      this.logger.prefix = String(`[row: ${chiRow.row.toString().padStart(4)}] `);
      this.logger.debug(`Processing row ...`);

      // Create a unique for the whole row
      const citation = this.createCitations(chiRow);

      this.logger.debug(`Creating Material 1 ...`);
      const material1: IMaterial = {            
        node: ['Material'],
        model_version: '1.0.0',
        name: `PPPDB_${chiRow.id}_${chiRow.compound1}`, // PPPDB_<Column AJ (id)>_<Column B (compound1) of chi.csv>
        names: [
          `${chiRow.compound1}`, // "<Column B (compound1) of chi.csv (string)>,
          `${chiRow.ac1}`,       // “<Column D (ac1) of chi.csv (string)>”
        ],
      };
      this.logger.debug(`Material 1 is a ${chiRow.type1}`);
      switch( chiRow.type1 ) {
        case 'polymer': {
          
          const polymer = this.getPolymerByName(polymers, chiRow.compound1);
          if(!polymer) {
            this.logger.error(`Unable to find a polymer for '${chiRow.compound1}'`)
          }
          material1.inchi = polymer?.InChI;
          material1.bigsmiles = this.generateBigSMILES(chiRow.compound1);

          // Add "mw_w" property only when molmass is defined
          if (chiRow.molmass1) {

            if( !chiRow.molmassunit ) {
              this.logger.warning(`molmass1 is defined but we don't have molmassunit. No unit will be assigned to this Property.`);
            }
           
            // create property
            material1.property = [{
              node: ['Property'],
              key: 'mw_w',
              type: 'value',
              value: chiRow.molmass1,
              unit: chiRow.molmassunit?.toLowerCase(), // Celcius => celsius, Kelvin => kelvin, etc..
              citation
            }];          
          }
          break;
        }
        case 'solvent': {

          // Strategy
          //   go to solvents.xlsx and find the row with "column D ('name of solvent (new)')" == “column B ('compound1') from chi.csv"
	        //   extract column G ('PubChem CID') and save as PubChemID
	        //   If unsuccessful, let me know
          const solvent = this.getSolventByName(solvents, chiRow.compound1);
          if( solvent === undefined ) {
            this.logger.error(`Unable to find the solvent ${chiRow.compound1}. Skipping row`);
            continue;
          }
          const pubchem_cid = solvent?.["PubChem CID"];
          if( pubchem_cid == '' || !pubchem_cid ) {
            this.logger.error(`pubchem_cid is expected for the solvent (row: ${solvent?.row} in ${options.paths.solvents}). Skipping row`)
            continue;
          }

          const pubchem_metadata = await this.fetchPubChem(pubchem_cid);
          material1.chem_formula = pubchem_metadata.chem_formula;
          material1.inchi = pubchem_metadata.inchi; // this value is also contained in polymer.xslx, but we prefer to fetch a fresh data      
          material1.bigsmiles = pubchem_metadata.smiles; // Note: we agree to use "bigsmiles" instead of "smiles". "smiles" is a subset of it "bigsmiles".
          break;
        }
      }
      this.addMaterial(material1);

      this.logger.debug(`Creating Material 2 ...`);
      const material2: IMaterial = {
        node: ['Material'],
        model_version: '1.0.0',
        name: '',
        names: [
          chiRow.compound2, // <Column F of chi.csv (string)>
          chiRow.ac2, // <Column H of chi.csv (string)>
        ]
      };
      this.logger.debug(`Material 2 is a ${chiRow.type2}`);
      switch(chiRow.type2) {
        case 'polymer':
          material2.name = `PPPDB_${chiRow.id}_${chiRow.compound2}`; // PPPDB_<Column AJ>_<Column F> 
          const polymer = this.getPolymerByName(polymers, chiRow.compound2);
          material2.inchi = polymer?.InChI;
          material2.bigsmiles = this.generateBigSMILES(chiRow.compound2);
          if( chiRow.molmass2 ) {
            if( !chiRow.molmassunit ) this.logger.message(`molmass2 found but molmass unit is undefined. Mass will be added with no unit.`);
            const property: IProperty = {
              node: ['Property'],
              key: 'mw_w',
              type: 'value',
              value: chiRow.molmass2, // <column K if present>
              unit: chiRow.molmassunit,
              citation
            };
            material2.property = [property];        
          }
          break;

        case 'solvent':
          material2.name = `PPPDB_${chiRow.id}_${chiRow.compound2}`; // PPPDB_<Column AJ>_<Column F> 
          // Strategy
          //   go to solvents.xlsx and find the row with "column D ('name of solvent (new)')" == “column B ('compound1') from chi.csv"
	        //   extract column G ('PubChem CID') and save as PubChemID
	        //   If unsuccessful, let me know
          // Strategy
          //   go to solvents.xlsx and find the row with "column D ('name of solvent (new)')" == “column B ('compound1') from chi.csv"
	        //   extract column G ('PubChem CID') and save as PubChemID
	        //   If unsuccessful, let me know
          const solvent = this.getSolventByName(solvents, chiRow.compound1);
          if( solvent === undefined ) {
            this.logger.error(`Unable to find the solvent '${chiRow.compound1}'. Skipping row`);
            continue;
          }
          const pubchem_cid = solvent?.["PubChem CID"];
          if( pubchem_cid == '' || !pubchem_cid ) {
            this.logger.error(`pubchem_cid is expected for the solvent (row: ${solvent?.row} in ${options.paths.solvents}). Skipping row`)
            continue;
          }

          const pubchem_metadata = await this.fetchPubChem(pubchem_cid);
          material1.chemical_id = pubchem_metadata.chemical_id;
          material1.chem_formula = pubchem_metadata.chem_formula;
          material1.inchi = pubchem_metadata.inchi; // this value is also contained in polymer.xslx, but we prefer to fetch a fresh data      
          material1.bigsmiles = pubchem_metadata.smiles; // Note: we agree to use "bigsmiles" instead of "smiles". "smiles" is a subset of it "bigsmiles".

          break;
        case 'other':
          this.logger.warning(`type2: ${chiRow.type2} is not handled yet. Skipping row`);
          continue;
      }
      this.addMaterial(material2);

      this.logger.debug(`Creating Combined Material ...`);
      switch( chiRow.type ) {
        case "Type 1":
          const combined_material = {
            node: ['Material'],
            name: `PPPDB_${chiRow.id}_${chiRow.compound1}_${chiRow.compound2}`, // PPPDB_<Column AJ>_<Material1>_<Material2>
            component: [
              material1,
              material2
            ],
            property: [] as Array<IProperty>
          } satisfies IMaterial;

          if( chiRow.composition1 ) {
            combined_material.property.push({
              node: ['Property'],
              key: 'conc_vol_fraction',
              type: 'value',
              value: chiRow.composition1,
              // unit: undefined
              component: [material1] 
            });
          }

          if( chiRow.composition2 ) {
            combined_material.property.push({
              node: ['Property'],
              key: 'conc_vol_fraction',
              type: 'value',
              value: chiRow.composition2,
              // unit: undefined
              component: [material2] 
            });
          } 

          // If column X (chimax) is blank
          if( !chiRow.chimax ) {
            const interaction_param = {
              node: ['Property'],
              key: 'interaction_param',
              type: 'value',
              value: chiRow.chinumber,
              uncertainty: chiRow.chierror,
              notes: `Method: ${chiRow.method}; Notes: ${chiRow.notes}`,
              // unit: undefined
              method: this.getMethodKeyByName(methods, chiRow.method), // can be undefined, we allow this
              component: [material2],
              condition: [] as ICondition[],
              citation
            } satisfies IProperty;
            combined_material.property.push(interaction_param);
            
            // If column P (tempmax) is blank, we can only have a single temperature.
            if( chiRow.tempmax ) {
              interaction_param.condition.push({
                node: ['Condition'],
                key: 'temperature',
                type: 'value',
                value: chiRow.temperature,
                unit: '<column Q>'
              });

            // Instead, If column P (tempmax) is NOT blank, we have a min/max.
            } else {
              interaction_param.condition.push({
                  node: ['Condition'],
                  key: 'temperature',
                  type: 'min',
                  value: chiRow.temperature, // temperature is considered as min in such case
                  unit: chiRow.tempunit
                },
                {
                  node: ['Condition'],
                  key: 'temperature',
                  type: 'max',
                  value: chiRow.tempmax,
                  unit: chiRow.tempunit
                });
            }

            // If column AK (refvolume) is NOT blank
            if( chiRow.refvolume ) {
              interaction_param.condition.push({
                node: ['Condition'],
                key: 'reference_volume',
                type: 'value',
                value: chiRow.refvolume,
                unit: chiRow.refvolumeunit
              });
            }
          }


          break;
        case "Type 2":
        case "Type 3":
        case "Type 4":
        case "Type 5":
          this.logger.warning(`Type '${chiRow.type}' not implemented yet. Combined material will be skipped.`);
      }
      this.logger.debug(`Row DONE.`)
    };
    
    this.logger.prefix = null;
    this.logger.message(`All rows have been parsed. Double-check the log above, might contain errors and/or warnings.`);

    // In this script, when a material is added (addMaterial) we just display a warning instead of throwing an error.
    // This is to simplify the correction process by fixing the whole xlsx file at once instead of doing it line by line.
    // That's why we do a global check here to avoid returning an invalid project.
    if( this.has_materials_with_non_unique_names ) {
      throw new Error(`Project: Two or more materials share the same name, check the log above.`)
    }

    this.logger.message(`=-=-=-=-=-=-=-=-=-==--=Report Start =-=-=-=-=-=-=-=-=-=-=-=-=-`);
    const missing_items = Object.values(this.missing).reduce( (prev, curr) => prev + curr.size , 0);
    if ( missing_items ) {
      this.logMissingItems( this.missing.molfile, 'molfile');
      this.logMissingItems( this.missing.solvent, 'solvent');
      this.logMissingItems( this.missing.polymer, 'polymer');
      this.logMissingItems( this.missing.method,  'method');
      this.logger.message(`=-=-=-=-=-=-=-=-=-==- Report Summary -=-=-=-=-=-=-=-=-=-=-=-=-=-`);      
      this.logger.error(`Missing items:`);
      this.logger.error(` - molfile(s): ${this.missing.molfile.size}`);
      this.logger.error(` - method(s):  ${this.missing.method.size}`);
      this.logger.error(` - polymer(s): ${this.missing.polymer.size}`);
      this.logger.error(` - solvent(s): ${this.missing.solvent.size}`);
    } else {
      this.logger.message(`No item is missing.`);
    }

    const project_validator = new ProjectValidator();
    try {
      const project_is_valid = await project_validator.validate('ProjectPost', this.project);
      if( project_is_valid ) {
        this.logger.message(`Project validation: OK`);
      } else {
        this.logger.error(`Project validation: KO (check logs)`);
      }
    } catch(err: any) {
      this.logger.error(`Project validation: KO`);
      this.logger.error(` - Exception: ${err.toString()}`);      
    }
    this.logger.error(` - Validator errors: ${project_validator.errorsText()}`);
    this.logger.message(`=-=-=-=-=-=-=-=-=-==--=- Report End =-=-=-=-=-=-=-=-=-=-=-=-=-`);
    this.logger.message(`PPPDB.loader() DONE`);

    return this.project;
  } // load()


  logMissingItems(missing_set: Set<string>, label: string) {
    if( missing_set.size > 0 ) {
      this.logger.error(`Missing ${label} count: ${missing_set.size}, see report below:`);
      missing_set.forEach( value => this.logger.error('\t- ', value) )
    }
  }
  
  getMethodKeyByName(methods: Method[], method: string): string | undefined {
    const result = methods.find( m => m.Method === method)?.["Method with key"];
    if ( !result && !this.missing.method.has(method) ) this.missing.method.add(method);
    return result;
  }

  getSolventByName(solvents: Solvent[], name: string): Solvent | undefined {
    const result = solvents.find( solvent => solvent["name of solvent (new)"] === name )
    if ( !result && !this.missing.solvent.has(name) ) this.missing.solvent.add(name);
    return result;
  }

  getPolymerByName(polymers: Polymer[], name: string): Polymer | undefined {
    const result = polymers.find( polymer => polymer["Name (new)"] === name );
    if ( !result && !this.missing.polymer.has(name) ) this.missing.polymer.add(name);
    return result;
  }

  /**
   * Generate a bigsmiles from a given compound name.
   * Internaly, the name is normalized and used to lookup in all
   * known (indexed) molfiles.
   * If the file is found, we use @cript-web/bigsmiles-toolkit to convert it to bigsmiles.
   */
  generateBigSMILES(compound_name: string): string | undefined {
    const molfile_clean_name = this.computeMolfileCleanName(compound_name);
    const molfile_path = this.molfile_name_to_path.get(molfile_clean_name);
    let molfile_string: string | undefined;
    let result: string | undefined;
    if ( !molfile_path) {
      this.logger.error(`No molfile found in indexed files for the key '${molfile_clean_name}'`);
      if ( !this.missing.molfile.has(molfile_clean_name) )
        this.missing.molfile.add(molfile_clean_name);
    } else if( fs.existsSync(molfile_path) ) {
      try {
        const molfile_descriptor = fs.openSync(molfile_path, 'r');
        molfile_string = fs.readFileSync(molfile_descriptor).toString();            
      } catch ( err ) {
        this.logger.error(`Unable to load the mol file ${molfile_path}. Reason: ${JSON.stringify(err)}`);
      }        
      if( molfile_string ) {
        try {
          result = molfile_to_bigsmiles(molfile_string); 
        } catch( err ) {
          this.logger.error(`Unable to convert the mol file ${molfile_path}. Reason: ${JSON.stringify(err)}`);
        }
      }
    } else {
      this.logger.error(`Molfile ${molfile_path} not found`);
    }
    return result;
  }

  /**
   * Ensure name is space free, lower case and contains the *.mol extension
   */
  computeMolfileCleanName(name: string): string {
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
  private createCitations(chiRow: Chi): ICitation[] | undefined {

    let reference: Required<Pick<IReference, 'node' | 'type' | 'title'>> & Partial<IReference> | undefined;

    //
    // Strategy:
    // - Try to get 'reference' first (column AH), then fallback on 'doi' (column A).
    // - When using 'reference', it should be 'doi:' or 'isbn:' prefixed, if not we throw an exception.
    // - If both 'reference' and 'doi' are undefined we throw an exception.
    //
    // Limitations:
    // - Do not handle semi-colon separated values (ex: chi.xlsx line 109: "DOI: 10.1021/ma50006a079 ; DOI: 10.1016/j.polymer.2007.09.039" )
    //

    if( chiRow.reference ) {
      const lower_case_doi_or_isbn = chiRow.reference.toLowerCase();

      if ( lower_case_doi_or_isbn.startsWith('doi:')) {
        reference = {
          node: ['Reference'],
          title: 'not implemented yet', // TODO: fetch from https://crossref.org
          doi: lower_case_doi_or_isbn.substring(4).trim(),
          type: 'journal_article'
        }
      } else if (lower_case_doi_or_isbn.startsWith('isbn:')) {
        reference = {
          node: ['Reference'],
          title: 'not implemented yet', // TODO: fetch from https://crossref.org
          isbn: lower_case_doi_or_isbn.substring(5).trim(),
          type: 'book'
        }
      } else if ( chiRow.reference.trim() === 'Ciation: Zaborski, M.; Kosmalska, A. Kautsch. Gummi Kunstst. 2005, 58, 354– 357.'  ) {
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
        reference = {
          node: ['Reference'],
          title: 'Silica modified by use of organosilanes as a filler for carboxylated butadiene-acrylonitrile rubber',
          issn: '0948-3276',
          type: 'journal_article'
        }

      } else {
        throw new Error(`Unable to handle reference: '${chiRow.reference}' (only 'doi:' and 'isbn:' are for now)`); // Data must be changed in such case, or specific hard-coded solution must be added.
      }
    } else if ( chiRow.doi ) {
      reference = {
        node: ['Reference'],
        title: 'not implemented yet', // TODO: fetch from https://crossref.org
        doi: chiRow.doi.toLocaleLowerCase().trim(),
        type: 'journal_article'
      }
    } else {
      this.logger.error(`Cannot find any reference or doi. This case is not implemented yet.`)
    }

    if(!reference) return undefined;

    return [{
      node: ['Citation'],
      type: "reference",
      name: reference.title,
      reference
    }];
  }

  /**
   * Loads the first sheet of a given *.xslx file
   * 
   * User has to know in advance the type of the expected JSON,
   * No check is done prior to return the data. In case you want to ensure the data has the right type
   * you must not set T to unknown and write discrimination tests.
   */
  private loadFirstSheet<T extends { row: number }>(file_path: string, options?: XLSX.ParsingOptions) {

    // Load the XLSX file
    this.logger.message(`Reading ${file_path} ...`);
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
    result.forEach( (each, index) => each.row = index + 1 ); // +1 for the header

    this.logger.message(`Found ${result.length} row(s)`);
    this.logger.message(`Here is a sample of the first row:\n ${JSON.stringify(result.slice(undefined, 1), null, '\t')}`);

    return result;
  }

 /**
 * Add a given material to the project, and checks if the material's name is unique.
 * In case the name is in use, a log is emitted.
 */
  private addMaterial(material: IMaterial) {
    if(this.material_unique_names.has(material.name)) {
      this.logger.error(`This material name is already in use: '${material.name}'`)
    } else {
      this.material_unique_names.add(material.name);
    }
    this.project.material.push(material);
  }

  /**
   * Fetch some metadata from PubChem using a given cid
   */
  async fetchPubChem(cid: string): Promise<{
    chem_formula?: string;
    chemical_id?: string;
    inchi?: string;
    smiles?: string;
  }> {

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
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/${prop_names.join(',')}/JSON`);
      if( response.ok ) {
        const data: PubChemPropertyResponse = await response.json(); // Take in consideration we do not check the conversion from "any" to "PubChemResponse"
        const properties = data.PropertyTable.Properties[0];        
        result = {
          inchi: properties.InChI,
          smiles: properties.CanonicalSMILES,
          chem_formula: properties.MolecularFormula,
        }
      } else {
        this.logger.error(`PubChem does not know the compound with CID = ${cid}`);
      }
    } catch (e) {
      this.logger.error(`Unable to fetch PubChem data. Reason: ${JSON.stringify(e)}`);
    }

    // Then, get the CAS from a different endpoint.
    // Note: we couldn't get the CAS using the first method, this method returns a much more complicated JSON,
    //       that's why we prefered the first method for the 3 other fields.
    try {
      // @see https://pubchem.ncbi.nlm.nih.gov/docs/pug-view#section=Specific-Heading
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/JSON?heading=CAS/JSON`);
      if( response.ok ) {
        const data: PubChemCASResponse = await response.json();
        // Since we searched for a known heading, we should have the expected result in the first sections
        const chemical_id_or_undefined = data.Record.Section.at(0)?.Section.at(0)?.Section.at(0)?.Information.at(0)?.Value.StringWithMarkup.at(0)?.String;
        if ( chemical_id_or_undefined ) {
          result.chemical_id = chemical_id_or_undefined;
        } else {
          this.logger.error(`Unable to find the CAS in response`)
        }
      } else {
        this.logger.error(`PubChem does not know the compound with CID = ${cid}`);
      }
    } catch (e) {
      this.logger.error(`Unable to fetch PubChem data. Reason: ${JSON.stringify(e)}`);
    }

    return result;
  }
} // namespace PPPDBLoader

