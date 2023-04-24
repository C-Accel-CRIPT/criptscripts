/**
 * The purpose of this script is to declare the Graph (defined in https://docs.google.com/presentation/d/1eXM7870YM2sxQQvMFahI2Ox8-EFCGaw_/edit#slide=id.p1)
 * and export it as a JSON file.
 *
 * Documentation reference on XSLX: https://docs.sheetjs.com/docs
 *
 * This script does not import all th sheets and columns.
 * See link to google drive files above (column_meanings.xlsx)
 */

import { finishedAsync, output_dir_path, write_json_helper as write_json_to_out_folder } from "@utilities";
import { resolve } from "path";
import * as fs from "fs";
import { BCDBLoader } from "./bcdb";

(async () => {
  // Use a streams for log and errors
  const logStream = fs.createWriteStream(resolve(output_dir_path, "bcdb.logs.txt"));
  const errorStream = fs.createWriteStream(resolve(output_dir_path, "bcdb.errors.txt"));

  const project = await BCDBLoader.load({
    input_file_path: resolve(__dirname, "data/sheets/bcdb.xlsx"),
    //log: process.stdout, // if you turn this ON, it will cause issues relative to memory. Something needs to be fixed on Streams to avoid this.
    sheets: [
      "blocks", // needs to be loaded first to get [Polymer, name, BigSMILES] tuples
      "diblock", // then the diblocks..
    ],
    limitSheetRows: 0, // 0 => unlimited
  });

  await Promise.all([
    finishedAsync(logStream),
    finishedAsync(errorStream),
    write_json_to_out_folder(project, "bcdb"),
    write_json_to_out_folder(project, "bcdb", "minified") // unoptimized, will stringify a second time
  ]);

  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  console.log("-=-=-=->>  WARNING: This script is WIP, do not use data for production.  <<-=-=-");
  console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
})();
