import { IProject } from "@cript";
import { LogLevel, Logger } from "@utilities";
import Ajv, { AnySchemaObject, Options } from "ajv";
import addFormats from "ajv-formats"
import fetch from "cross-fetch";

/**
 * Simple class to validate a CRIPT Project
 */
export class CriptProjectValidator {
    
    private ajv: Ajv;
    private logger: Logger;

    constructor(ajvOptions: Options = {
        allErrors: true,
    }, verbosity = LogLevel.INFO ) {
        this.ajv = new Ajv(ajvOptions);
        addFormats(this.ajv); // for "date-time"
        this.logger = new Logger({outstream: process.stdout, timestamp: false, verbosity });
        this.logger.prefix = '[CriptProjectValidator] ';
    }

    private async fetchSchema(url: string): Promise<AnySchemaObject> {
               let response: Response;
        try {
            response = await fetch(url);
        } catch(error: any) {
            throw new Error(`Unable to fetch schema from '${url}'`);
        }

        if(!response.ok) throw new Error(`Unable to fetch schema from '${url}', reponse: ${JSON.stringify(response)}`);        

        const schema = (await response.json()).data;
        return schema;
    }

    async validate(type: 'ProjectPost' | 'ProjectPatch', project: IProject): Promise<boolean> {
        let schema: AnySchemaObject;
        try {
            const url = process.env.CRIPT_SCHEMA_URL;
            if(!url) {
                this.logger.error(`CRIPT_SCHEMA_URL is undefined. Define it in your .env file`);
                return false;
            }
            this.logger.info(`Fetching DB schema from '${url}'`);
            schema = await this.fetchSchema(url);
            this.logger.info(`Found DB found`);
        } catch( error: any ) {
            this.logger.error(`Unable to validate.\nReason:\n${error.message}, ${error.stack}`)
            return false;
        }

        schema['$ref'] = `#/$defs/${type}`;
        this.logger.info(`Validating ....`);
        const is_valid = Boolean(await this.ajv.validate(schema, project));
        this.logger.info(`Validating DONE`);
        return is_valid;
    }

    logErrors() {
        const errors = this.errorsAsString();
        if(errors.length === 0) {
            return  this.logger.info(`No error found.`)
        }
        this.logger.error(errors);
    }

    errorsAsString(limit = 100) {
        if ( !this.ajv.errors ) {
            return '';
        }
        const firstErrorsCount = Math.min(limit, this.ajv.errors.length);
        const firstErrors = this.ajv.errors.slice(0, firstErrorsCount);
        const errorsAsJSONString = JSON.stringify(firstErrors, null, '  ');
        return `Here are the first ${limit} error(s) found:\n${errorsAsJSONString}\n${this.ajv.errors?.length} error(s) found, see log above.}`;
    }
}