import { AFRLtoJSON as AFRLCSVtoJSON } from "./scripts/afrl-csv-to-json";
import fs from 'fs';
import path from 'path';

const package_directory_path = path.resolve();
const output_dir_path = path.resolve(package_directory_path, './out/');
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
    const input_csv_file_path = path.resolve(package_directory_path, `./src/data/${file_name}`);
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

/**
 * Helper to write a JSON to a given filename
 */
function write_json_helper(obj: any, filename: string, mode: 'human-readable' | 'minified') {
    console.log(`Writting ${mode} JSON ...`)
    const output_json = mode === 'minified' ? JSON.stringify(obj) : JSON.stringify(obj, null, '\t');
    const output_filename = mode === 'minified' ? `${filename}.min.json` : `${filename}.json`
    const output_filepath = path.resolve(output_dir_path, output_filename);
    const output_file = fs.openSync(output_filepath, 'w');
    fs.writeFileSync(output_file, output_json);
    console.log(`Writting  ${mode} JSON OK: ${output_filepath}`)
}