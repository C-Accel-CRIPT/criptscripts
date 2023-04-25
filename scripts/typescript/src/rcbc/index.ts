/**
 * The purpose of this script is to declare the Graph (defined in https://docs.google.com/presentation/d/1eXM7870YM2sxQQvMFahI2Ox8-EFCGaw_/edit#slide=id.p1)
 * and export it as a JSON file.
 */

import { write_json_helper as write_json_to_out_folder } from "@utilities";
import { project } from "./data/graph/project";

(async() => {

    await write_json_to_out_folder(project, "rcbc");
    await write_json_to_out_folder(project, "rcbc", "minified");
    
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
    console.log('-=-=-=->>  WARNING: This script is WIP, do not use data for production.  <<-=-=-');
    console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
})();
