import { AFRLtoJSON as AFRLLoader } from "./scripts/afrl-loader";
import { data as afrl_data} from "./data/data";
import fs from 'fs';
import path from 'path';

console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-= AFRL to JSON -=-=-=-=-=-=-==-=-=-=-=-=-=-=')
console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')

// Instantiate AFRL to JSON serializer
const serializer = new AFRLLoader({
    inventory_basename: 'afrl-inventory',
    project_name: 'afrl-project'
});

// Get project from raw data
const project = serializer.load(afrl_data);

// Ensure output directory exists
const dirname = path.resolve();
const output_dir_path =  path.resolve(dirname, './out/');
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

/**
 * Helper to write a JSON to a given filename
 */
function write_json_helper(obj: any, filename: string, mode: 'human-readable' | 'minified') {
    console.log('Writting pretty JSON ...')
    const output_json = mode === 'minified' ? JSON.stringify(obj) : JSON.stringify(obj, null, '\t');
    const output_filename = mode === 'minified' ? `${filename}.min.json` : `${filename}.json` 
    const output_filepath =  path.resolve(output_dir_path, output_filename );
    const output_file = fs.openSync(output_filepath, 'w');
    fs.writeFileSync( output_file, output_json);
    console.log(`Writting minified JSON OK: ${output_filepath}`)
}