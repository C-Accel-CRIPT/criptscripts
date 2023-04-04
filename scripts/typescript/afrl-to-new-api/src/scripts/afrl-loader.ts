import { AFRLData } from "../types/afrl"
import { ICitation, ICollection, ICondition, IIdentifier, IInventory, IMaterial, IPrimary, IProject, IProperty, IReference } from "../types/cript"
import { CitationType } from "../types/cript/ICitation";

/**
 * This script is a typescript port of @see https://github.com/C-Accel-CRIPT/criptscripts/tree/master/scripts/python_sdk_scripts/AFRL
 * The main difference is the data is already well structured to be used in TS (see ../data/data.ts).
 * The reason why data is a a AFRLData[] is because the legacy frontend (django app) had a JS file with the same data in it.
 * Having a *.ts file is very usefull to have autocompletion and static typecheck. * 
 */

export type Config = {
    // Destination project's name
    project_name: string;
    // Destination inventory's basename
    inventory_basename: string;    
}
export class AFRLtoJSON {

    // declare few maps to retreive data easily

    private readonly citations = new Map<string, ICitation>();
    private readonly solvents = new Map<string, IMaterial>();
    private readonly polymers = new Map<string, IMaterial>();
    private readonly mixtures = new Map<string, IMaterial>();

    // The project data will be stored in
    private project: IProject;

    // The collection data will be stored in
    private collection: ICollection;

    // The inventories data will be stored in
    private inventory_solvents: IInventory;
    private inventory_polymers: IInventory;
    private inventory_mixtures: IInventory;

    private errors: Array<string> = [];

    constructor(config: Config = AFRLtoJSON.load_config()) {

        // Create inventories

        this.inventory_solvents = {
            name: `${config.inventory_basename} (solvents)`,
            material: [],
            node: ['Inventory'],
            notes: `Gather all the solvents extracted from AFRL dataset`,
        } as any;
        
        this.inventory_polymers = {
            name: `${config.inventory_basename} (polymers)`,
            material: [],
            node: ['Inventory'],
            notes:`Gather all the polymers extracted from AFRL dataset`,
        } as any;

        this.inventory_mixtures = {
            name: `${config.inventory_basename} (mixtures)`,
            material: [],
            node: ['Inventory'],
            notes:`Gather all the mixtures extracted from AFRL dataset`,
        } as any;

        // Create collection with the inventories in it
        this.collection = {
            name: "afrl", // will be overriden by user config
            notes:`Gather the 3 inventories extracted from AFRL dataset`,
            inventory: [
                this.inventory_solvents,
                this.inventory_polymers,
                this.inventory_mixtures
            ] as IInventory[]
        } as ICollection;

        // Create a project with the collection in it        
        this.project = {
            name: config.project_name,
            node: ['Project'],
            collection: [this.collection]
        } as IProject;
        
    }

    get_errors(): any {
        return [...this.errors];
    }

    get_citation(row: AFRLData): ICitation {

        // Check if citation was already created
        const existing_citation = this.citations.get(row.reference);
        if ( existing_citation ) {            
            console.log(`-- Found existing reference: ${existing_citation.name}`)
            return existing_citation;
        }

        // Create citation
        const citation: ICitation = {
            node: ['Citation'],
            name: row.reference,
            reference: {
                node: ['Reference'],
                created_at: "",
            } as IReference,
            type: CitationType.reference
        } as ICitation;

        // get DOI and authors
        const DOI_DOT_ORG = "doi.org/";
        if( row.reference.includes(DOI_DOT_ORG) ) {
            citation.reference.doi = row.reference.replace(DOI_DOT_ORG, "");
        } else {
            // Putting the whole text as an author
            citation.reference.author = [row.reference];

            // The following does not work, but a better version can work.
            // I am unsure the reference is always formatted the same way.
            // citation.reference.author = row.reference.split(',')            // Authors are usually splitted by comas.
            //                                          .map( a => a.trim() ); // remove empty pre/post spaces
        }

        // Store in hashmap
        this.citations.set(row.reference, citation);
    
        return citation;

    }

    get_solvent(row: AFRLData): IMaterial {

        const cas = row.solvent_CAS.trim(); // will be used as key in the hashmap this.solvent

        // Try to reuse an existing solvent
        const existing_solvent = this.solvents.get(cas);
        if (existing_solvent) {
            console.log(`-- Found existing solvent: ${existing_solvent.name} (cas: ${cas})`)
            return existing_solvent
        }
    
        // Pull solvent from server
        // Blocker: the script assumes the solvent already exists on the backend, but we probably don't have it.
        /*
        try {
            solvent = api.get(
                cript.Material, 
                {
                    "identifiers": [
                        {
                            "key": "cas", 
                            "value": cas
                        }
                    ], 
                    "project": cript_project.uid
                },
                max_level=0
            )
            print(f"ROW {index + 2} -- Found existing solvent: {solvent.name}")
            solvents[cas] = solvent
            return solvent
        except (cript.exceptions.APIGetError):
            return None
        */

        // Temporary solution: we create a new Solvent...        
        const solvent: IMaterial = {
            node: ['Material'],
            name: row.solvent,
            cas
        } as IMaterial;
        this.record_error(`Search material from "cas" is not implemented, creating a local solvent for ${JSON.stringify(solvent)}`)

        // Store in hashmap
        this.solvents.set(cas, solvent);

        return solvent;
    }

    get_polymer(row: AFRLData, citation: ICitation[] = []): IMaterial {
    
        const polymer_id = row.polymer_id;
        const name = row.polymer;
        const unique_name = `${name}_${polymer_id}`;
        const cas = row.polymer_CAS;
        const bigsmiles = this.smiles_to_BigSMILES(row.polymer_SMILES)
        const mw_w = row.polymer_Mw;
        const mw_d = row.polymer_PDI;
    
        // Try to get the existing
        if( citation ) {
            // Note: previous implementation was using both mw_w, mw_d, and name as hash, but using unique_name seems more appropriate.
            const existing_polymer = this.polymers.get(unique_name);
            if (existing_polymer) {
                console.log(`-- Found existing polymer: ${unique_name}`)
                return existing_polymer;
            }
        }
        // Create properties
        const properties: IProperty[] = [];
        if (mw_w && !isNaN(mw_w))
            properties.push({
                key: "mw_w",
                value: mw_w,
                unit: "g/mol",
                citation,
                node: ['Property']
            } as IProperty)

        if (mw_d && !isNaN(mw_d))
            properties.push({
                key: "mw_d",
                value: mw_d,
                unit: "",
                citation,
                node: ['Property']
            } as IProperty) 
    
       
        // Create new material object
        const polymer: IMaterial = {
            name: unique_name,
            property: properties,
            node: ['Material']
        } as IMaterial;

        // Create identifiers
        //
        // note: the new API does not have a concept for the legacy's API Identifiers.
        //       We have to set those directly on the Material node.
        //
        if(name){
            polymer.names = [name]; // Not sure about that, waiting for Brilant's answer.
            //identifiers.push(cript.Identifier(key="prefered_name", value=name))
        }
        if(cas){
            polymer.cas = cas;
            //identifiers.push(cript.Identifier(key="cas", value=cas))
        }
        if(bigsmiles){
            polymer.bigsmiles = bigsmiles;
            //identifiers.push(cript.Identifier(key="bigsmiles", value=bigsmiles))
        }
        
        this.polymers.set(unique_name, polymer);
        return polymer
    }

    get_mixture(row: AFRLData, polymer: IMaterial, solvent: IMaterial, citation: ICitation[] = []): IMaterial {

        const name = `${polymer.name}${solvent.name} mixture`;
        const unique_name = `${name} (${row.mixture_id})`

        const conc_vol_fraction = row.polymer_vol_frac;
        const conc_mass_fraction = row.polymer_wt_frac;
        const temp_cloud = row.cloud_point_temp;
        const one_phase_direction = row.one_phase_direction;
        const pressure = row.pressure_MPa;

        // Create new material object
        const mixture: IMaterial = {
            node: ['Material'],
            name: unique_name,
            // "identifiers": identifiers, deprecated, see explanation below
            component: [
                polymer,
                solvent
            ],
            property: [],
            created_at: "",
            locked: false,
            model_version: "",
            names: [],
            notes: "",
            public: false,
            uid: "",
            updated_at: "",
            uuid: "",
            project: [],
            keyword: [],
            parent_material: "",
            property_count: 0,
            component_count: 0,
            identifier_count: 0,
            computational_forcefield: unique_name
        } as IMaterial;

        // Create identifiers
        //
        // The concept of Identifier separate from Material does not exist anymore on the new API.
        // Instead, a Material has each possible identifier as its own object property.
        // 
        if (name) {
            // There is no such field in the new API
            // identifiers.append(cript.Identifier(key="preferred_name", value=name))
            // Waiting for Brilant's answer I am using names instead.
            mixture.names.push(name)
        }
    
        // Create properties
        if (conc_vol_fraction && ! isNaN(conc_vol_fraction) ) {
            mixture.property.push({
                key: "conc_vol_fraction",
                value: conc_vol_fraction,
                // "components_relative" does not exist on new API, using "component" instead.         
                component: [polymer],
                citation,
                node: ['Property']
            } as IProperty)
        }

        if (conc_mass_fraction && ! isNaN(conc_mass_fraction) ) {
            mixture.property.push({
                key: "conc_mass_fraction",
                value: conc_mass_fraction,
                // "components_relative" does not exist on new API, using "component" instead.         
                component: [polymer],
                citation,
                node: ['Property']
            } as IProperty)
        }

        if (temp_cloud && ! isNaN(temp_cloud) ) {
            
            const temp_cloud_property: IProperty = {
                key: "temp_cloud",
                value: temp_cloud,
                // "components_relative" does not exist on new API, using "component" instead.         
                component: [polymer],
                citation,
                node: ['Property'],
                type: "",
                unit: "degC",
                condition: [],
                data: [],
                computation: [],
                created_at: "",
                updated_at: "",
                model_version: "",
                uuid: "",
                uid: "",
                uncertainty: "",
                uncertainty_type: "",
                sample_preparation: "",
                notes: "",
                structure: "",
                method: ""
            };

            // If present, add conditions

            if (pressure)
                temp_cloud_property.condition.push({
                    key: "pressure",
                    value: pressure as any, // FIXME: typings are wrong, we should be able to use a number
                    unit: "MPa"
                } as ICondition);

            if (one_phase_direction)
                temp_cloud_property.condition.push({
                    key: "+one_phase_direction", // Not sure this will work, needs custom vocabulary (starts with a "+").
                    value: one_phase_direction,
                } as ICondition);

            // Add property to the mixture
            mixture.property.push(temp_cloud_property);
        }
        
        // Store in hashmap
        this.mixtures.set(mixture.name, mixture);

        return mixture;    
    }


    private smiles_to_BigSMILES(smiles: string): string | undefined {

        if( !smiles || smiles == '') return undefined;

        // Replace * with [<] and [>]
        let bigsmiles: string;
        const tokens = smiles.split('*');
        
        switch( tokens.length ) {
            case 1:
                bigsmiles = tokens[0];
                break;
            case 3:
                bigsmiles = `${tokens[0]}[<]${tokens[1]}[>]${tokens[2]}`;
                break;
            default:
                this.record_error(`Unable to convert smiles to BigSMILES, should have zero or two "*": ${smiles}`);
                return undefined;
        }

        return `{{[]${bigsmiles}[]}}`;
    }


    private record_error(message: string): void {
        
        this.errors.push(message)
        console.error(message);
    }

    /**
     * Load a single AFRL data
     * @param row object is called raw because this script was originaly dealing with a CSV file
     *            In case you need to use a CSV again, just implement a CSV to AFRL[] method.
     */
    private load_row(row: AFRLData): boolean {

        // get objects common to this row

        const citation = this.get_citation(row) // is not required
        const solvent = this.get_solvent(row)

        if (!solvent) {
            // Record error and skip row if solvent is not found
            this.record_error(`Solvent not found: ${row.solvent} (${row.solvent_CAS})`);
            return false;
        }        
        this.inventory_solvents.material.push(solvent)
    
        const polymer = this.get_polymer(row, [citation])
        this.inventory_polymers.material.push(polymer)
    
        const mixture = this.get_mixture(row, polymer, solvent, [citation])
        this.inventory_mixtures.material.push(mixture)

        return true;
    }

    private static load_config(): Config {
        /*
        try:
            with open("config.yaml", "r") as f:
                config = yaml.safe_load(f)
        except FileNotFoundError:
            config = {}
    
        if config.get("host") is None:
            config["host"] = input("Host (e.g., criptapp.org): ")
        if config.get("token") is None:
            config["token"] = getpass("API Token: ")
        if config.get("group") is None:
            config["group"] = input("Group name: ")
        if config.get("project") is None:
            config["project"] = input("Project name: ")
        if config.get("collection") is None:
            config["collection"] = input("Collection name: ")
        if config.get("inventory") is None:
            config["inventory"] = input("Inventory name: ")
        if config.get("path") is None:
            config["path"] = input("Path to CSV file: ").strip('"')
        */

        return {
            inventory_basename: 'afrl-inventory',
            project_name: 'afrl-project'
        }
    }

    load(data: AFRLData[]): IProject {

        // load data
        console.log('Loading data ...')
        const failed_rows: AFRLData[] = [];
        let one_based_index = 1;
        const data_length = data.length;
        for (let row of data) {
            console.log(`Loading data ${one_based_index}/${data_length} ...`)
            if( !this.load_row(row) ) {
                failed_rows.push(row);
            }
            one_based_index++;
        }        

        // Log failures
        if( failed_rows.length != 0) {
            console.log(`Loading failed. Some objects couldn't be loaded (${failed_rows.length} row(s) failed)`)
            failed_rows.forEach( v => console.error(JSON.stringify(v)) )
            throw new Error(`${failed_rows.length} row(s) were not loaded.`)
        }

        // hack
        // In order to avoid to push multiple times the same Node, we have to
        // set a "uid" (not "uuid"), which is like a local id.
        this.solvents.forEach( each =>  each.uid = `_:${each.cas}`)
        this.mixtures.forEach( each =>  each.uid = `_:${each.cas}`)
        this.polymers.forEach( each =>  each.uid = `_:${each.cas}`)

        console.log('Loading data OK')
        return this.project;
        
    }
}