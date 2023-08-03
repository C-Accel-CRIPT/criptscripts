/**
 * The purpose of this script is to convert BCBD's XLSX to CRIPT JSON.
 * @see BCBDLoader for more information
 */

import { LogLevel, finishedAsync, output_dir_path, write_json_helper as write_json_to_out_folder } from "@utilities";
import { resolve } from "path";
import * as fs from "fs";
import { BCDBLoader } from "./bcdb";

(async () => {
  console.log('BCDB index.ts script running ...');

  // Use a streams for log and errors
  const log_file_path = resolve(output_dir_path, "bcdb.logs.txt");
  const logStream = fs.createWriteStream(log_file_path);

  const loader = new BCDBLoader({ logger: {
    outstream: logStream, // We use a stream to reduce considerably CPU usage compared to console.log|warn|error|info() which flushes after each call.
    verbosity: LogLevel.INFO, // Consider reducing the verbosity when needed, it will reduce log output
    timestamp: true, // Not required, but usefull to figure out when a problem occured.
  }});

  try {
    console.log('Loading ...');
    const project = await loader.load({
      input_file_path: resolve(__dirname, "data/sheets/bcdb.xlsx"),
      sheets: [
        "blocks", // needs to be loaded first to get [Polymer, name, BigSMILES] tuples
        "diblock", // then the diblocks..
      ],
      limitSheetRows: 0, // 0 => unlimited
    });
    console.log('Loading OK');
    console.log('Saving JSON ...');
    await Promise.all([
      write_json_to_out_folder(project, "bcdb"),
      write_json_to_out_folder(project, "bcdb", "minified"),
    ]);
    console.log('Saving JSON OK');
  } catch( error: any ) {
    console.log(`An error occured, check errors in '${log_file_path}'.\nReason:\n`, error.message, error.stack)
  }

  loader.logger.warning("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  loader.logger.warning("-=-=-=->>  WARNING: This script is WIP, do not use data for production.  <<-=-=-");
  loader.logger.warning("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

  console.log('Writting logs ...');
  await finishedAsync(logStream);
})();
