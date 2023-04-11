import { AFRLData } from "../types/afrl"
import { ICitation, ICollection, ICondition, IInventory, IMaterial, IProject, IProperty, IReference } from "@cript"
import csvtojson from "csvtojson";

/**
 * This script is a typescript port of @see https://github.com/C-Accel-CRIPT/criptscripts/tree/master/scripts/python_sdk_scripts/AFRL
 * The main difference is the source data is now read from the original CSV and not a preprocessed *.js.
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
            notes: `Gather all the polymers extracted from AFRL dataset`,
        } as any;

        this.inventory_mixtures = {
            name: `${config.inventory_basename} (mixtures)`,
            material: [],
            node: ['Inventory'],
            notes: `Gather all the mixtures extracted from AFRL dataset`,
        } as any;

        // Create collection with the inventories in it
        this.collection = {
            name: "afrl", // will be overriden by user config
            notes: `Gather the 3 inventories extracted from AFRL dataset`,
            node: ['Collection'],
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
            collection: [this.collection],
            material: new Array<IMaterial>()
        } as IProject;

    }

    get_errors(): any {
        return [...this.errors];
    }

    private get_citation(row: AFRLData): ICitation | undefined {

        if(row.reference === undefined) {
            this.record_error(`Unable to get)citation for row ${row.csv_raw_index}`)
            return undefined;
        }
        // Check if citation was already created
        const existing_citation = this.citations.get(row.reference);
        if (existing_citation) {
            console.log(`-- Found existing reference: ${existing_citation.reference.title}`)
            return existing_citation;
        }

        // Create citation
        const citation: ICitation = {
            node: ['Citation'],
            reference: {
                title: row.reference,
                type: 'database', // raw string, should be ideally picked from vocab
                node: ['Reference'],
            } as IReference,
            type: 'reference',
        } as ICitation;

        // get DOI and authors
        const DOI_DOT_ORG = "doi.org/";
        if (row.reference.includes(DOI_DOT_ORG)) {
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

    private get_solvent(row: AFRLData): IMaterial {

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
            cas,
        } as IMaterial;
        this.record_error(`Search material from "cas" is not implemented, creating a local solvent for ${JSON.stringify(solvent)}`)

        // Store in hashmap
        this.solvents.set(cas, solvent);

        return solvent;
    }

    private get_polymer(row: AFRLData, citation: ICitation[] = []): IMaterial {

        const polymer_id = row.polymer_id;
        const name = row.polymer;
        const unique_name = `${name}_${polymer_id}`;
        const cas = row.polymer_CAS;
        const bigsmiles = this.smiles_to_BigSMILES(row.polymer_SMILES)
        const mw_w = row.polymer_Mw;
        const mw_d = row.polymer_PDI;

        // Try to get the existing
        if (citation) {
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
                value: String(mw_w), // FIXME: backend does not accept numbers
                unit: "g/mol",
                citation,
                node: ['Property'],
                type: 'value'  // FIXME: is this correct from a chemist point of view?
            } as IProperty)

        if (mw_d && !isNaN(mw_d))
            properties.push({
                key: "mw_d",
                value: String(mw_d), // FIXME: backend does not accept numbers,
                unit: "",
                citation,
                node: ['Property'],
                type: 'value'  // FIXME: is this correct from a chemist point of view?
            } as IProperty)


        // Create new material object
        const polymer: IMaterial = {
            name: unique_name,
            property: properties,
            node: ['Material'],
        } as IMaterial;

        // Create identifiers
        //
        // note: the new API does not have a concept for the legacy's API Identifiers.
        //       We have to set those directly on the Material node.
        //
        if (name) {
            polymer.names = [name]; // Not sure about that, waiting for Brilant's answer.
            //identifiers.push(cript.Identifier(key="prefered_name", value=name))
        }
        if (cas) {
            polymer.cas = cas;
            //identifiers.push(cript.Identifier(key="cas", value=cas))
        }
        if (bigsmiles) {
            polymer.bigsmiles = bigsmiles;
            //identifiers.push(cript.Identifier(key="bigsmiles", value=bigsmiles))
        }

        this.polymers.set(unique_name, polymer);
        return polymer
    }

    private get_mixture(row: AFRLData, polymer: IMaterial, solvent: IMaterial, citation: ICitation[] = []): IMaterial {

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
            names: [unique_name],
        } as Partial<IMaterial> as any; // HACK: had to pick some fields, backend does not allow all the fields in the context of a POST.

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
        if (conc_vol_fraction && !isNaN(conc_vol_fraction)) {
            mixture.property.push({
                key: "conc_vol_fraction",
                value: String(conc_vol_fraction), // FIXME: backend does not accept numbers,
                // "components_relative" does not exist on new API, using "component" instead.         
                component: [polymer],
                citation,
                node: ['Property'],
                type: 'value',  // FIXME: is this correct from a chemist point of view?
            } as IProperty)
        }

        if (conc_mass_fraction && !isNaN(conc_mass_fraction)) {
            mixture.property.push({
                key: "conc_mass_fraction",
                value: String(conc_mass_fraction), // FIXME: backend does not accept numbers
                // "components_relative" does not exist on new API, using "component" instead.         
                component: [polymer],
                citation,
                node: ['Property'],
                type: 'value',  // FIXME: is this correct from a chemist point of view?
            } as IProperty)
        }

        if (temp_cloud && !isNaN(temp_cloud)) {

            const temp_cloud_property: IProperty = {
                key: "temp_cloud",
                value: String(temp_cloud), // FIXME: backend does not accept numbers
                // "components_relative" does not exist on new API, using "component" instead.         
                component: [polymer],
                citation,
                node: ['Property'],
                type: 'value',  // FIXME: is this correct from a chemist point of view?
                unit: "degC",
                condition: [] // will be filled below...
            } as Partial<IProperty> as any;

            // If present, add conditions

            if (pressure)
                temp_cloud_property.condition.push({
                    node: ['Condition'],
                    key: "pressure",
                    value: String(pressure), // FIXME: typings are wrong, we should be able to use a number
                    unit: "MPa",
                } as ICondition);


            if (one_phase_direction) {

                // FIXME: uncomment once backend accepts custom vocab (starts with a "+")
                /*
                temp_cloud_property.condition.push({
                    node: ['Condition'],
                    key: "+one_phase_direction", // Not sure this will work, needs custom vocabulary (starts with a "+").
                    value: one_phase_direction,
                    model_version: MODEL_VERSION,
                } as ICondition);*/

                this.record_error(`one_phase_direction cannot be stored in CRIPT, +one_phase_direction vocab is not allowed.`)
            }

            // Add property to the mixture
            mixture.property.push(temp_cloud_property);
        }

        // Store in hashmap
        this.mixtures.set(mixture.name, mixture);

        return mixture;
    }


    private smiles_to_BigSMILES(smiles: string): string | undefined {

        if (!smiles || smiles == '') return undefined;

        // Replace * with [<] and [>]
        let bigsmiles: string;
        const tokens = smiles.split('*');

        switch (tokens.length) {
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
        this.add_material(solvent, this.inventory_solvents);

        const citation_as_array = citation ? [citation] : [];
        const polymer = this.get_polymer(row, citation_as_array)
        this.add_material(polymer, this.inventory_polymers);

        const mixture = this.get_mixture(row, polymer, solvent, citation_as_array)
        this.add_material(mixture, this.inventory_mixtures);

        return true;
    }

    /**
     * Helper to push a material into a project and a given inventory
     * @param material 
     * @param inventory 
     */
    add_material(material: IMaterial, inventory: IInventory) {
        
        // note: here I do not check if inventry is a part of a collection in this.project
        //       but by design (cf. constructor) the inventory should be a part of it.

        this.project.material.push(material);
        inventory.material.push(material);
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

    /**
     * Load a CSV file to typesafe datastructure
     * @param csv_file_path the path to the csv file (must be absolute or relative to the package)
     * @returns 
     */
    async load_csv(csv_file_path: string): Promise<AFRLData[]> {
        console.log(`Loading file and converting to javascript data types: ${csv_file_path} ...`)
        const raw_json: { [key: string]: string }[] = await csvtojson().fromFile(csv_file_path)
        console.log(`Found ${raw_json.length} rows found in CSV. File is now converted as a { [key: string]: string }[] `)

        // Log randomly N samples
        const random_samples_count = 3;
        console.log(`Logging ${random_samples_count} samples randomly...`);
        for (let i = 0; i < random_samples_count; ++i) {
            const random_index = Math.floor(Math.random() * (raw_json.length - 1));
            console.log(`row #${random_index}:`)
            console.log(JSON.stringify(raw_json[random_index], null, '  '))
        }
        console.log(`Logging samples randomly DONE`);

        
        // Checking data against type
        console.warn(`Assigning default value for string properties ...`)
        console.warn(`Data validation is not 100% safe, some fields might be missing. TODO: install AJV and create a schema for AFRLData type.`)

        // Use typecheck to list all (unique) fields existing on AFRLdata
        const empty_data: AFRLData = {

            cloud_point_temp: 0,
            mixture_id: 0,
            one_phase_direction: "",
            polymer_CAS: "",
            polymer_id: 0,
            polymer_PDI: 0,
            polymer_Mw: 0,
            polymer_SMILES: "",
            polymer_vol_frac: 0,
            polymer_wt_frac: 0,
            polymer: "",
            pressure_MPa: 0,
            reference: "",
            solvent_CAS: "",
            solvent_Mw: 0,
            solvent_SMILES: "",
            solvent: ""
        }
        const afrldata_type_fields = [...Object.keys(empty_data) as Array<keyof AFRLData>];

        const to_number_or_undefined = (value: string ) => value != '' ? Number.parseFloat(value) : undefined;

        const afrl_data = raw_json.map( (raw_object, index) => {
            /*
                At this stage a row is like that (sample is not representative, some data may be different (ex: reference)):
                {
                    mixture_id: '1',
                    polymer_id: '1',
                    polymer: 'polystyrene',
                    polymer_CAS: '9003-53-6',
                    polymer_SMILES: '*C(C*)c1ccccc1',
                    solvent: 'methylcyclohexane',
                    solvent_CAS: '108-87-2',
                    solvent_SMILES: 'CC1CCCCC1',
                    polymer_Mw: '17500',
                    polymer_PDI: '1.060606061',
                    polymer_vol_frac: '0.114055986',
                    polymer_wt_frac: '0.15',
                    pressure_MPa: '82.81',
                    cloud_point_temp: '21.34',
                    one_phase_direction: 'positive',
                    reference: 'doi.org/10.1002/macp.1994.021950233'
                    }
            */

            // Check if all the fields in raw_object exists in AFRLData type (can use default values in this case)
            //const missing_field_on_raw_object = afrldata_type_fields.find( field => !Object.keys(raw_object).includes(field));
            //if( missing_field_on_raw_object ) console.warn(`The field ${missing_field_on_raw_object} cannot be found in: ${JSON.stringify(raw_object)}, default value will be used`);

            // Check it all fields in AFRLData type exists in raw_object (data will be discarded in this case, dev must be done)
            const missing_field_on_afrldata_type = Object.keys(raw_object).find(field => !afrldata_type_fields.includes(field as any));
            if (missing_field_on_afrldata_type) this.record_error(`The field ${missing_field_on_afrldata_type} cannot be found in: ${JSON.stringify(afrldata_type_fields)}, field will be ignored. Requires some development.`);

            const safe_object: AFRLData = {
                
                csv_raw_index: index + 1, // one-based index, because the CSV column names use the raw 0.

                reference: raw_object.reference,
                one_phase_direction: raw_object.one_phase_direction,
                polymer_CAS: raw_object.polymer_CAS,
                polymer_SMILES: raw_object.polymer_SMILES,
                polymer: raw_object.polymer,                
                solvent_CAS: raw_object.solvent_CAS,
                solvent_SMILES: raw_object.solvent_SMILES,
                solvent: raw_object.solvent,
                ...{
                    solvent_Mw: to_number_or_undefined(raw_object.solvent_Mw),
                    polymer_Mw: to_number_or_undefined(raw_object.polymer_Mw),
                    cloud_point_temp: to_number_or_undefined(raw_object.cloud_point_temp),
                    mixture_id: to_number_or_undefined(raw_object.mixture_id),
                    polymer_id: to_number_or_undefined(raw_object.polymer_id),
                    polymer_PDI: to_number_or_undefined(raw_object.polymer_PDI),
                    polymer_vol_frac: to_number_or_undefined(raw_object.polymer_vol_frac),
                    polymer_wt_frac: to_number_or_undefined(raw_object.polymer_wt_frac),
                    pressure_MPa: to_number_or_undefined(raw_object.pressure_MPa),
                }
            } as Partial<AFRLData> as any;
            return safe_object;
        });
        console.log(`Assigning default value for string properties OK`);
        return afrl_data;
    }

    /**
     * Loads structured AFRLData[] into a project
     * @param data 
     * @returns 
     */
    load_data(data: AFRLData[]): IProject {

        // load data
        console.log('Loading data ...')
        const failed_rows: AFRLData[] = [];
        let one_based_index = 1;
        const data_length = data.length;
        for (let row of data) {
            console.log(`Loading data ${one_based_index}/${data_length} ...`)
            if (!this.load_row(row)) {
                failed_rows.push(row);
            }
            one_based_index++;
        }

        // Log failures
        if (failed_rows.length != 0) {
            console.log(`Loading failed. Some objects couldn't be loaded (${failed_rows.length} row(s) failed)`)
            failed_rows.forEach(v => console.error(JSON.stringify(v)))
            throw new Error(`${failed_rows.length} row(s) were not loaded.`)
        }

        console.log('Loading data OK')
        return this.project;
    }
}