/**
 * The purpose of this script is to upload a generated CRIPT JSON to the API.
 */
import { CriptGraph, CriptValidator, output_dir_path } from "@utilities";
import { resolve } from "path";
import * as fs from "fs";
import { CriptApiClient, CriptApiClientConstructorOptions } from "../utilities/cript-api-client";
import * as process from "process";
import { IProject } from "@cript";
import { PPPDBJSON } from "./pppdb-loader";

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
    return;
  }

  // Ensure JSON is valid

  const { shared, project } = JSON.parse(json) as PPPDBJSON;
  const validator = new CriptValidator();
  await validator.init();
  const is_valid = validator.validate('ProjectPost', project);
  if( !is_valid ) throw new Error('Project JSON is invalid');

  // Prepare API client for upload

  if( !process.env.API_BASE_URL ) throw new Error('Please define API_BASE_URL env var')
  if( !process.env.API_TOKEN ) throw new Error('Please define API_TOKEN env var')

  const client = new CriptApiClient({
    API_BASE_URL: process.env.API_BASE_URL ,
    API_TOKEN: process.env.API_TOKEN,
  });

  // Upload references first
  console.log(`PPPDB Upload references ...`);
  await client.post_shared_references(shared.reference);
  console.log(`PPPDB Upload references: DONE`);

  console.log(`PPPDB Upload project ...`);
  if( !project.uuid ) {
    throw new Error('Project must have an uuid')
  }

  // Post empty project first
  console.log(`PPPDB Upload empty project ...`);
  await client.post('Project', { ...project, material: [] })

  // Upload material by material
  console.log(`PPPDB Upload materials ...`);

  // Materials can be published by set of 3 materials (component 1, component 2, and compound)
  let index = 0;
  const materials = project.material ?? [];
  while( index < materials.length ) {

    const start = index;
    const end   = Math.min(materials.length, index +  3 * 50); // Must be limited to 1000 nodes (children included)
    const chunk = materials.slice(start, end)

    // Try to patch with a full node
    console.log(`PPPDB Upload material chunk [${start}-${end}] (total: ${materials.length}) ...`);
    const payload_full = { material: chunk };
    const response = await client.patch('Project', payload_full, project.uuid);

    // if exist already, try to patch with an EdgeUUID
    if (response.code === 409) {
      console.error("Material already exists!", JSON.stringify(response, null, " "));
    }

    index += chunk.length;
  }
  console.log(`PPPDB Upload project: DONE`);
})();
