import * as fs from 'fs';
import * as path from 'path';
import { output_dir_path } from './path';
import { CriptJSON } from './cript-json';

/**
 * Helper to write a JSON to a given filename
 */
export function write_json_helper(value: any, filename: string, mode: 'human-readable' | 'minified') {
    console.log(`Writting ${mode} JSON ...`)
    const output_json = mode === 'minified' ? CriptJSON.stringify(value) : CriptJSON.stringify(value, '  ');
    const output_filename = mode === 'minified' ? `${filename}.min.json` : `${filename}.json`
    const output_filepath = path.resolve(output_dir_path, output_filename);
    const output_file = fs.openSync(output_filepath, 'w');
    fs.writeFileSync(output_file, output_json);
    console.log(`Writting  ${mode} JSON OK: ${output_filepath}`)
}