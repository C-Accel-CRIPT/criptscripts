/**
 * The purpose of this script is to valida a given project JSON
 */

import { IProject } from "@cript";
import { CriptProjectValidator } from "@utilities";
import { readFileSync } from "fs";
import { isAbsolute, resolve } from "path";
import { argv, exit } from "process";

(async() => {

    const project_path = argv[2];

    if( !project_path ) {
        console.error('Missing argument, an absolute file path is expected.');
        print_help();
        exit(1);
    }

    console.log('project_path', project_path);

    const validator = new CriptProjectValidator();
    try {
        const absolute_project_path = isAbsolute(project_path) ? project_path : resolve(__dirname, project_path);
        console.log('Absolute file path is:', absolute_project_path);

        console.log(`Loading file ... `);
        const buffer = readFileSync(absolute_project_path);
        console.log(`OK\n`);

        console.log(`Parsing file ... `);
        const project = JSON.parse(buffer.toString()) as IProject;
        console.log(`OK\n`);

        console.log(`Validating file ... `);
        const is_valid = await validator.validate('ProjectPost', project);
        console.log(`${ is_valid ? 'OK' : 'ERROR!' }\n`);

        if( !is_valid ) {
            validator.logErrors();
            exit(1);
        }

    } catch (error: any) {
        console.error(`Unable to load file, reason:\n`, error.message, error.stack);
        exit(1);
    }

    exit(0);
})();


function print_help() {
    console.log(`Usage: npm run validate absolute/or/relative/path/to/my/project.json`);
}
