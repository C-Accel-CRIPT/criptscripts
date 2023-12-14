import { AFRLtoJSON as AFRLCSVtoJSON } from "./afrl-csv-to-json";
import fs from 'fs';
import path from 'path';
import { output_dir_path, write_json_helper } from "@utilities";

const file_name = 'AFRL_linear_polymer_3pdb_data_csv_4_5_2023.csv'; // TODO: read this from command line argument

(async () => { // Immediately called async (no await at top level on this nodejs version)

    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-= AFRL CSV to JSON -=-=-=-=-=-==-=-=-=-=-=-=-=')
    console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
    
    // Pipe the errors in a file
    const error_file_path = path.resolve(output_dir_path, 'afrl.errors.txt');
    const error_file = fs.createWriteStream(error_file_path, { flags: 'w'});
    error_file.write("Beginnin of the conversion...\n");
    error_file.write("Second line")

    // Instantiate AFRL to JSON serializer
    const serializer = new AFRLCSVtoJSON({
        inventory_basename: 'AFRL (dev)',
        project_name: 'AFRL (dev)',
        error_stream: error_file
    });

    // Load the CSV into an AFRLData[]
    const input_csv_file_path = path.resolve(__dirname, 'data', file_name);
    const afrl_data = await serializer.load_csv(input_csv_file_path);

    // Load the AFRLData[] to a Project
    const project = await serializer.make_project(afrl_data);

    // Ensure output directory exists    
    console.log('Ensure output folder path exists ...')
    console.log(`Path: ${output_dir_path}`)
    if (!fs.existsSync(output_dir_path)) {
        console.log(`Output folder path does not exist, creating it ...`)
        if( !fs.mkdirSync(output_dir_path, { recursive: true }) ) {
            throw new Error(`Unable to make output directory! (path: ${output_dir_path})`)
        }
        console.log(`Output folder path created.`)
    }

    // Write JSON files
    await write_json_helper(project, 'afrl', 'human-readable');
    await write_json_helper(project, 'afrl.min', 'minified');

    console.log(`Files saved. Browse ${output_dir_path} folder.`)
})()

