import { AFRLtoJSON as AFRLCSVtoJSON } from "./scripts/afrl-csv-to-json";
import fs from 'fs';
import path from 'path';
import { output_dir_path } from "../utils/path";
import { write_json_helper } from "../utils/json";

const file_name = 'AFRL_linear_polymer_3pdb_data_csv_4_5_2023.csv'; // TODO: read this from command line argument

// Call main as a promise because low level await are not allowed.
main().then( code => process.exit(code) )

async function main(): Promise<number> {

    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-= AFRL CSV to JSON -=-=-=-=-=-==-=-=-=-=-=-=-=')
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
    
    // Instantiate AFRL to JSON serializer
    const serializer = new AFRLCSVtoJSON({
        inventory_basename: 'afrl-deleteme',
        project_name: 'afrl-deleteme'
    });

    // Load the CSV into an AFRLData[]
    const input_csv_file_path = path.resolve(__dirname, 'data', file_name);
    const afrl_data = await serializer.load_csv(input_csv_file_path);

    // Load the AFRLData[] to a Project
    const project = serializer.load_data(afrl_data);

    // Ensure output directory exists    
    console.log('Ensure output folder path exists ...')
    console.log(`Path: ${output_dir_path}`)
    if (!fs.existsSync(output_dir_path)) {
        console.log(`Output folder path does not exist, creating it ...`)
        fs.mkdirSync(output_dir_path, { recursive: true });
        console.log(`Output folder path created.`)
    }
    console.log('Output folder is ready')

    // Write JSON files

    write_json_helper(project, 'afrl-transformed', 'minified')
    write_json_helper(project, 'afrl-transformed', 'human-readable')
    write_json_helper(serializer.get_errors(), 'afrl-transformed.errors', 'human-readable')

    return 0;
}

