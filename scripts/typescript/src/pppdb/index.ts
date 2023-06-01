/**
 * The purpose of this script is to convert PPPDB's XLSX to CRIPT JSON.
 * @see PPPDBLoader for more information
 */

import { LogLevel, output_dir_path, write_json_helper as write_json_to_out_folder } from "@utilities";
import { resolve } from "path";
import * as fs from "fs";
import { PPPDBLoader } from "./pppdb";
import { stdout } from "process";

(async () => {
  const log_file_path = resolve(output_dir_path, 'pppdb.logs.txt');
  const log_file_stream = fs.createWriteStream(log_file_path);

  console.log(`Running script ...`);

  log_file_stream.write("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");
  log_file_stream.write("-=-=-=->>                   PPPDB Ingestion Script                       <<-=-=-\n");
  log_file_stream.write("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");

  const pppdbLoader = new PPPDBLoader({
    logger: { 
      outstream: log_file_stream, // replace by stdout if wou want to see logs in console
      verbosity: LogLevel.MSG // use LogLevel.DBG to get exhaustive logs
    }});

  const project = await pppdbLoader.load({
    paths: {
      chi: resolve(__dirname, "data/sheets/chi.xlsx"),
      methods: resolve(__dirname, "data/sheets/methods.xlsx"),
      polymers: resolve(__dirname, "data/sheets/polymers.xlsx"),
      solvents: resolve(__dirname, "data/sheets/solvents.xlsx"),
      molfile_dir: resolve(__dirname, "data/molfiles/")
    },
    limitSheetRows: 0, // 0 => unlimited
  });

  await Promise.all([
    write_json_to_out_folder(project, "pppdb"),
    write_json_to_out_folder(project, "pppdb", "minified") // unoptimized, will stringify a second time
  ]);

  log_file_stream.write("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");
  log_file_stream.write("-=-=-=->>  WARNING: This script is WIP, do not use data for production.  <<-=-=-\n");
  log_file_stream.write("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");

  console.log(`Script logs: ${log_file_path}`);

  return log_file_stream.close();

})();
