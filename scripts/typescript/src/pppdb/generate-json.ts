/**
 * The purpose of this script is to convert PPPDB's XLSX to CRIPT JSON.
 * @see PPPDBLoader for more information
 */

import { LogLevel, output_dir_path, write_json_helper as write_json_to_out_folder } from "@utilities";
import { resolve } from "path";
import * as fs from "fs";
import { PPPDBJSON, PPPDBLoader } from "./pppdb-loader";
import { IProject } from "@cript";

(async () => {
  const log_file_path = resolve(output_dir_path, 'pppdb.logs.txt');
  const log_file_stream = fs.createWriteStream(log_file_path);

  console.log(`PPPDB Ingestion Script: running ...`);

  const pppdb_loader = new PPPDBLoader({
    logger: { 
      outstream: log_file_stream,
      verbosity: LogLevel.DEBUG, // use LogLevel.DEBUG to get exhaustive logs
      timestamp: true,
    }});
    
  const logger = pppdb_loader.logger;
  // Uncomment to see logs in console (will slow down)
  // logger.logStream.pipe(stdout);

  logger.info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  logger.info("-=-=-=->>                   PPPDB Ingestion Script                       <<-=-=-");
  logger.info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

  const sheets_dir = resolve(__dirname, "data/sheets");

  let result: PPPDBJSON | undefined;

  try {
    result = await pppdb_loader.load({
      paths: {
        others: resolve(sheets_dir, "others.xlsx"),
        chi: resolve(sheets_dir, "chi.xlsx"),
        methods: resolve(sheets_dir, "methods.xlsx"),
        polymers: resolve(sheets_dir, "polymers.xlsx"),
        solvents: resolve(sheets_dir, "solvents.xlsx"),
      },
      row_limit: 0, // 0 => unlimited
    });
  } catch (error: any) {
    console.error(`An error occurred during pppdb_loader.load()`, error);
  }

  if( !result )
  {
    log_file_stream.close();
    throw new Error('No result or project')
  }

  try {
    await Promise.race([
      write_json_to_out_folder(result, "pppdb"),
      write_json_to_out_folder(result, "pppdb", "minified")
    ]);
  } catch (error: any) {
    console.error(`An error occurred during write_json_to_out_folder.`, error);
  }

  console.log(`PPPDB Ingestion Script: DONE, see logs: ${log_file_path}`);

  return log_file_stream.close();

})();
