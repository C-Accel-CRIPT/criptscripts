/**
 * The purpose of this script is to upload a generated CRIPT JSON to the API.
 */
import { output_dir_path } from "@utilities";
import { resolve } from "path";
import * as fs from "fs";

(async () => {

  console.log(`PPPDB Upload Script: running ...`);
  //const json_path = resolve(output_dir_path, 'pppdb.min.json');
  const json_path = resolve(output_dir_path, 'pppdb.json');

  // Read JSON
  let json: string | undefined;
  try {
    console.log(`-- opening JSON ...`)
    const json_file = fs.openSync(json_path, "r");

    console.log(`-- JSON is open, reading file ...`)
    json = fs.readFileSync(json_file, { encoding: 'utf8'});

    const sample_length =  Math.min(json.length, 128);
    console.log(`-- JSON read, see a sample of the ${sample_length} first chars:`)
    console.log(json.substring(0, sample_length) );
    console.log(` - - - - - JSON cut here - - - - - - \n`)

  } catch (e: any) {
    console.error(`Unable to open JSON. Did you run pppdb:generate-json first? Make sure '${json_path}' exists.`, e.stack)
  }

  // Save the Project (POST) with no materials

  // Save the Project (PATCH) by chunk of N Material.


  console.log(`PPPDB Upload Script: DONE`);
})();
