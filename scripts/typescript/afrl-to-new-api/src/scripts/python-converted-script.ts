import { AFRLData } from "../types/afrl"
import { ICitation, IInventory, IMaterial, IReference } from "../types/cript"
import { CitationType } from "../types/cript/ICitation";

/**
 * This script is a typescript port of @see https://github.com/C-Accel-CRIPT/criptscripts/tree/master/scripts/python_sdk_scripts/AFRL
 * The main difference is the data is already well structured to be used in TS (see ../data/data.ts).
 * The reason why data is a a AFRLData[] is because the legacy frontend (django app) had a JS file with the same data in it.
 * Having a *.ts file is very usefull to have autocompletion and static typecheck. * 
 */
export type Config = {
    
    // Inventory name
    inventory: string;
}

export class AFRLtoJSON {

    readonly citations = new Map<string, ICitation>();
    readonly solvents = new Array<IMaterial>();
    readonly polymers = new Array<IMaterial>();
    readonly mixtures = new Array<IMaterial>();

    inventory_solvents: IInventory;
    inventory_polymers: IInventory;
    inventory_mixtures: IInventory;

    constructor(config: Config = AFRLtoJSON.load_config()) {

        this.inventory_solvents = {
            name: `${config.inventory} (solvents)`
        } as any;
        this.inventory_polymers = {
            name: `${config.inventory} (polymers)`
        } as any;
        this.inventory_mixtures = {
            name: `${config.inventory} (mixtures)`
        } as any;
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
        const name = row.reference.includes("doi.org") ? row.reference.replace("doi.org", "").split("/").at(0) : row.reference;
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
        throw new Error("Function not implemented yet")
    }

    get_polymer(row: AFRLData, citation: ICitation): IMaterial {
        /*
    
         // original code
        /////////////////
    
        polymer_id = row["polymer_id"]
        name = row["polymer"]
        unique_name = name + f"_{polymer_id}"
        cas = row["polymer_CAS"]
        bigsmiles = _convert_to_bigsmiles(row["polymer_SMILES"])
        mw_w = row["polymer_Mw"]
        mw_d = row["polymer_PDI"]
    
        # Return repeats
        unique_set = (mw_w, mw_d, citation.reference.title)
        if unique_set in polymers.keys():
            print(f"ROW {index + 2} -- Found existing polymer: " + polymers[unique_set].name)
            return polymers[unique_set]
    
        # Create identifiers
        identifiers = []
        if name:
            identifiers.append(cript.Identifier(key="preferred_name", value=name))
        if cas:
            identifiers.append(cript.Identifier(key="cas", value=cas))
        if bigsmiles:
            identifiers.append(cript.Identifier(key="bigsmiles", value=bigsmiles))
    
        # Create properties
        properties = []
        if not math.isnan(mw_w):
            properties.append(cript.Property(key="mw_w", value=mw_w, unit="g/mol", citations=[citation]))
        if not math.isnan(mw_d):
            properties.append(cript.Property(key="mw_d", value=mw_d, citations=[citation]))
    
        # Create new material object
        polymer_dict = {
            "project": project,
            "name": unique_name,
            "identifiers": identifiers,
            "properties": properties,
            "public": True
        }
        polymer = cript.Material(**polymer_dict)
    
        #Save material or update and use existing
        api.save(polymer, update_existing=True, max_level=0)
    
        polymers[unique_set] = polymer
        return polymer
        */
        throw new Error("Function not implemented yet")
    }

    get_mixture(row: AFRLData, polymer: IMaterial, solvent: IMaterial, citation: ICitation): IMaterial {

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

    _convert_to_bigsmiles(old_smiles: string): string {
        /*
        
         // original code
        /////////////////
        # Replace * with [<] and [>]
        bigsmiles = "[<]".join(old_smiles.split("*", 1))
        bigsmiles = "[>]".join(bigsmiles.rsplit("*", 1))
        
        return f"{{[]{bigsmiles}[]}}"
        */
        throw new Error("Function not implemented yet")

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

    upload(row: AFRLData): void {

        const citation = this.get_citation(row) // common to this row
        const solvent = this.get_solvent(row)

        if (!solvent) {
            // Record error and skip row if solvent is not found
            this.record_error(`Solvent not found: ${row.solvent} (${row.solvent_CAS})`);
            return;
        }
        /*
        inventory_solvents.materials.append(solvent)
    
        polymer = get_polymer(index, row, citation)
        inventory_polymers.materials.append(polymer)
    
        mixture = get_mixture(index, row, polymer, solvent, citation)
        inventory_mixtures.materials.append(mixture)
        */
        throw new Error("Function not implemented yet")
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
            inventory: 'local-inventory-test'
        } // We do not need this for now

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
        for (let row of data) {
            this.upload(row);
        }
        this.update_inventories()
    }
}