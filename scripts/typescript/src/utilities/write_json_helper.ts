import * as fs from 'fs';
import * as path from 'path';
import { output_dir_path } from './output_dir_path';
import { CriptJSON } from './cript-json';
import { finishedAsync } from '@utilities';

/**
 * Helper to write a JSON to a given filename.
 * 
 * This function is not synchronous and required to be awaied before program exits
 */
export function write_json_helper(
    value: any,
    output_file_name: string,
    mode: 'human-readable' | 'minified' = 'human-readable',
    method: 'as_stream' | 'as_string' = 'as_string'
    ): Promise<any> {
    
    // prepare output file path
    const output_filename = mode === 'minified' ? `${output_file_name}.min.json` : `${output_file_name}.json`;
    const output_filepath = path.resolve(output_dir_path, output_filename);

    // make output directory path (if missing)
    if( !fs.existsSync(output_dir_path)) fs.mkdirSync(output_dir_path); 

    // open a stream to the output file    
    const file_stream = fs.createWriteStream(output_filepath, {flags: 'w'});
    file_stream.on('pipe', () => console.log(`Writting ${mode} JSON to: ${output_filepath} ...`))
    file_stream.on('error',(e) => console.log(`-- Error: ${e.message}`))
    file_stream.on('close',() => console.log(`-- Writting ${mode} JSON to: ${output_filepath} DONE`))

    // Transform: value => JSON => file
    const space = mode === 'minified' ? undefined : 2;

    if( method === 'as_stream' ) {
        console.warn(`as_stream is known to have issues, see CriptJSON.stringifyAsStream() implem.`);
        CriptJSON.stringifyAsStream(file_stream, value, space);
    } else { // 'as_string'
        const jsonAsString = CriptJSON.stringify(value, space);
        file_stream.write( jsonAsString );
    }    

    return finishedAsync(file_stream);
}