import { IProject } from "@cript";
import Ajv, { AnySchemaObject, Options } from "ajv";
import addFormats from "ajv-formats"
import fetch from "cross-fetch";

/**
 * Simple class to validate a CRIPT Project
 */
export class CriptProjectValidator {
    
    private ajv: Ajv;

    constructor(options: Options = {
        allErrors: true,
    }) {
        this.ajv = new Ajv(options);
        addFormats(this.ajv); // for "date-time"
    }

    private async fetchSchema(): Promise<AnySchemaObject> {
        const url = process.env.CRIPT_SCHEMA_URL;
        if(!url) {
            throw new Error(`CRIPT_SCHEMA_URL is undefined. Define it in your .env file`)
        }
        
        let response: Response;
        try {
            response = await fetch(url);
        } catch(error: any) {
            throw new Error(`Unable to fetch schema from '${url}'`);
        }

        if(!response.ok) throw new Error(`Unable to fetch schema from '${url}', reponse: ${JSON.stringify(response)}`);
        console.log(`Using schema '${url}'`);

        const schema = (await response.json()).data;
        return schema;
    }

    async validate(type: 'ProjectPost' | 'ProjectPatch', project: IProject): Promise<boolean> {
        let schema: AnySchemaObject;
        try {
            schema = await this.fetchSchema();
        } catch( error: any ) {
            console.error(`Unable to validate, fetchSchema failed. Reason: ${error.message}, ${error.stack}`)
            return false;
        }

        schema['$ref'] = `#/$defs/${type}`;
        return Boolean(await this.ajv.validate(schema, project));
    }

    logErrors() {
        const errors = this.errorsAsString();
        if(errors.length === 0) {
            return console.log(`No error found.`)
        }
        console.error(errors);
    }

    errorsAsString() {
        if ( !this.ajv.errors ) {
            return '';
        }
        const errorsAsJSONString = JSON.stringify(this.ajv.errors, null, '  ');
        return `${errorsAsJSONString}\n${this.ajv.errors?.length} error(s) found, see log above.}`;
    }
}