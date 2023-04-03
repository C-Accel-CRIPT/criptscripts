import { AFRLData } from "../types/afrl"
import { ICitation, ICollection, IIdentifier, IInventory, IMaterial, IPrimary, IProject, IProperty, IReference } from "../types/cript"
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

    readonly citations = new Map<string, ICitation>();
    readonly solvents = new Map<string, IMaterial>();
    readonly polymers = new Map<string, IMaterial>();
    readonly mixtures = new Map<string, IMaterial>();

    // The project data will be stored in
    project: IProject;

    // The collection data will be stored in
    collection: ICollection;

    // The inventories data will be stored in
    inventory_solvents: IInventory;
    inventory_polymers: IInventory;
    inventory_mixtures: IInventory;

    constructor(config: Config = AFRLtoJSON.load_config()) {

        // Create inventories
        this.inventory_solvents = {
            name: `${config.inventory_basename} (solvents)`,
            material: []
        } as any;
        this.inventory_polymers = {
            name: `${config.inventory_basename} (polymers)`,
            material: []
        } as any;
        this.inventory_mixtures = {
            name: `${config.inventory_basename} (mixtures)`,
            material: []
        } as any;

        // Create collection with the inventories in it
        this.collection = {
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

    get_citation(row: AFRLData): ICitation | undefined {
        /*     
         // original code
        /////////////////
    
        reference_title = row["reference"]
    
        # Check if citation was already created
        if row["reference"] in citations.keys():
            print(f"ROW {index + 2} -- Found existing reference: {reference_title}")
            return citations[row["reference"]]
    
        # Create reference
        reference = cript.Reference(group=group, title=reference_title, public=True)
        if "doi.org" in reference_title:
            reference.doi = reference_title.replace("doi.org", "").strip("/")
    
        #Save reference or update and use existing
        api.save(reference, update_existing=True, max_level=0)
    
        # Create citation
        citation = cript.Citation(reference=reference)
        citations[citation.reference.title] = citation
    
        return citation
        */           

        // Check if citation was already created
        const existing_citation = this.citations.get(row.reference);
        if ( existing_citation ) {            
            console.log(`Found existing reference: ${existing_citation.name}`)
            return existing_citation;
        }

        // Create citation
        const DOI_DOT_ORG = "doi.org";
        const name = row.reference.includes(DOI_DOT_ORG) ? row.reference.replace(DOI_DOT_ORG, "").split("/").at(0) : row.reference;
        const citation: ICitation = {
            node: ['Citation'],
            name,
            reference: {
                node: ['Reference'],
                created_at: "",
                doi: row.reference
            } as IReference,
            type: CitationType.reference
        } as ICitation;

        // Store in hashmap
        this.citations.set(row.reference, citation);
    
        return citation

    }

    get_inventory(name: string): IInventory {
        /*
         // original code
        /////////////////
    
        inventory = cript.Inventory(group=group, collection=collection, name=inventory_name, materials=[], public=True)
    
        #Save inventory or update and use existing
        api.save(inventory, update_existing=True, max_level=0)
    
        return inventory
        */
        throw new Error("Function not implemented yet")
    }

    get_solvent(row: AFRLData): IMaterial {
        /*
        // original code
        /////////////////

        cas = row["solvent_CAS"].strip()
    
        # Skip repeats
        if cas in solvents.keys():
            solvent = solvents[cas]
            print(f"ROW {index + 2} -- Found existing solvent: {solvent.name}")
            return solvent
    
        try:
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

        const cas = row.solvent_CAS.trim();

        // Try to reuse an existing solvent
        const existing_solvent = this.solvents.get(cas);
        if (existing_solvent) {
            console.log(`-- Found existing solvent: ${existing_solvent.name}`)
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
            name: row.solvent,
            cas
        } as IMaterial;

        // Store in hashmap
        this.solvents.set(row.solvent, solvent);

        return solvent;
    }

    get_polymer(row: AFRLData, citation?: ICitation): IMaterial {
    
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
                citation: citation ? [citation] : [],
                node: ['Property']
            } as IProperty)

        if (mw_d && !isNaN(mw_d))
            properties.push({
                key: "mw_d",
                value: mw_d,
                unit: "",
                citation: citation ? [citation] : [],
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

    get_mixture(row: AFRLData, polymer: IMaterial, solvent: IMaterial, citation?: ICitation): IMaterial {

        /*    
         // original code
        /////////////////
    
        mixture_id = row["mixture_id"]
        name = f"{polymer.name} + {solvent.name} mixture"
        unique_name = name + f" ({mixture_id})"
        conc_vol_fraction = row["polymer_vol_frac"]
        conc_mass_fraction = row["polymer_wt_frac"]
        temp_cloud = row["cloud_point_temp"]
        one_phase_direction = row["one_phase_direction"]
        pressure = row["pressure_MPa"]
    
        # Create identifiers
        identifiers = []
        if name:
            identifiers.append(cript.Identifier(key="preferred_name", value=name))
    
        # Create components
        components = [
            polymer,
            solvent
        ]
    
        # Create properties
        properties = []
        if not math.isnan(conc_vol_fraction):
            properties.append(
                cript.Property(key="conc_vol_fraction", value=conc_vol_fraction, components_relative=[polymer], citations=[citation])
            )
        if not math.isnan(conc_mass_fraction):
            properties.append(
                cript.Property(key="conc_mass_fraction", value=conc_mass_fraction, components_relative=[polymer], citations=[citation])
            )
        if not math.isnan(temp_cloud):
            properties.append(
                cript.Property(
                    key="temp_cloud", 
                    value=temp_cloud, 
                    unit="degC", 
                    conditions=[],
                    citations=[citation]
                )
            )
            if pressure:
                properties[-1].conditions.append(cript.Condition(key="pressure", value=pressure, unit="MPa"))
            if one_phase_direction:
                properties[-1].conditions.append(cript.Condition(key="+one_phase_direction", value=one_phase_direction))
    
        # Create new material object
        mixture_dict = {
            "project": project,
            "name": unique_name,
            "identifiers": identifiers,
            "components": components,
            "properties": properties,
            "public": True
        }
        mixture = cript.Material(**mixture_dict)
    
        # Save material or update and use existing
        api.save(mixture,update_existing=True, max_level=0)
    
        mixtures[mixture.name] = mixture
        return mixture
    
        */
        throw new Error("Function not implemented yet")

    }

    private smiles_to_BigSMILES(old_smiles: string): string {
        // Replace * with [<] and [>]
        let bigsmiles = "[<]".concat(old_smiles.split("*", 1)[0])
        bigsmiles = "[>]".concat(bigsmiles.split("*", 1)[1])
        
        return `{{[]${bigsmiles}[]}}`;
    }


    record_error(message: string): void {
        /*
        error_file = open("./errors.txt", "a")
        error_file.write(message + "\n\n")
        error_file.close()
        print(message)
        */
        throw new Error("Function not implemented yet")
    }


    update_inventories(): void {
        /*
        print("Updating Inventory nodes.")
    
        # Update solvent inventory
        api.save(inventory_solvents, max_level=0)
        print(f"Updated solvent inventory.")
    
        # Update polymer inventory
        api.save(inventory_polymers, max_level=0)
        print(f"Updated polymer inventory.")
    
        # Update mixture inventory
        api.save(inventory_mixtures, max_level=0)
        print(f"Updated mixture inventory.")
        */

        throw new Error("Function not implemented yet")
    }

    /**
     * Load a single AFRL data
     * @param row object is called raw because this script was originaly dealing with a CSV file
     *            In case you need to use a CSV again, just implement a CSV to AFRL[] method.
     */
    load(row: AFRLData): boolean {

        // get objects common to this row

        const citation = this.get_citation(row) // is not required
        const solvent = this.get_solvent(row)

        if (!solvent) {
            // Record error and skip row if solvent is not found
            this.record_error(`Solvent not found: ${row.solvent} (${row.solvent_CAS})`);
            return false;
        }        
        this.inventory_solvents.material.push(solvent)
    
        const polymer = this.get_polymer(row, citation)
        this.inventory_polymers.material.push(polymer)
    
        const mixture = this.get_mixture(row, polymer, solvent, citation)
        this.inventory_mixtures.material.push(mixture)

        return true;
    }

    static load_config(): Config {
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

    to_JSON(data: AFRLData[]): void {
        // Establish connection with the API
        // api = cript.API(config["host"], config["token"]) // skip that, we want to produce a JSON

        // Fetch objects <--------- TODO
        /*
        const group = api.get(cript.Group, {"name": config["group"]}, max_level=0)
        const project = api.get(cript.Project,{"name": config["project"]}, max_level=0)
        const cript_project = api.get(cript.Project, {"name": "CRIPT"}, max_level=0)
        const collection = api.get(cript.Collection, {"name": config["collection"], "project": project.uid}, max_level=0)

        const inventory_solvents = get_inventory(config["inventory"] + " (solvents)")
        const inventory_polymers = get_inventory(config["inventory"] + " (polymers)")
        const inventory_mixtures = get_inventory(config["inventory"] + " (mixtures)")
        */

        // Upload data
        const failed_rows: AFRLData[] = [];
        for (let row of data) {
            if( !this.load(row) ) {
                failed_rows.push(row);
            }
        }
        this.update_inventories();
        if( failed_rows.length != 0) {
            console.error(`Unable to load ${failed_rows.length} row(s), logging them:`)
            failed_rows.forEach( v => console.error(JSON.stringify(v)) )
            console.error(`Logged ${failed_rows.length} row(s) the script was unable to load.`)
        }
    }
}