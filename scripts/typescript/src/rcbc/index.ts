/**
 * The purpose of this script is to declare the Graph (defined in https://docs.google.com/presentation/d/1eXM7870YM2sxQQvMFahI2Ox8-EFCGaw_/edit#slide=id.p1)
 * and export it as a JSON file. 
 */

import { write_json_helper as write_json_to_out_folder } from "../utils/json";
import { project } from "./project"; // project is a const object and already has its content (materials, collections...)

// console.log(`RCBC JSON is:\n\n${JSON.stringify(project, null, ' ')}`)
write_json_to_out_folder(project, 'rcbc-transformation', 'human-readable');
write_json_to_out_folder(project, 'rcbc-transformation', 'minified');