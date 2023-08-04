import { ICriptObject, IMaterial, IPrimary, IProject, Slug } from "@cript";
import { LogLevel, Logger, LoggerOptions } from "@utilities";
import Ajv, { AnySchemaObject, Options } from "ajv";
import addFormats from "ajv-formats"
import fetch from "cross-fetch";

// Reference to a given schema
type CriptObjectRef = `${string}${'Post'|'Patch'}` |'Edge' | 'EdgeUUID';

/**
 * Simple class to validate a CRIPT object
 */
export class CriptValidator {
    
    private ajv: Ajv;
    private logger: Logger;
    private master_schema: AnySchemaObject | null;

    constructor(ajvOptions: Options = {
        allErrors: true,
    }, loggerOptions: LoggerOptions = {
        outstream: process.stdout,
        timestamp: false,
        verbosity: LogLevel.INFO
    }) {
        this.ajv = new Ajv(ajvOptions);
        addFormats(this.ajv); // for "date-time"
        this.logger = new Logger(loggerOptions);
        this.logger.prefix = '[CriptProjectValidator] ';
        this.master_schema = null;
    }

    async init(): Promise<boolean> {
        const url = process.env.CRIPT_SCHEMA_URL;
        if(!url) {
            this.logger.error(`CRIPT_SCHEMA_URL is undefined. Define it in your .env file`);
            return false;
        }
        this.logger.debug(`Fetching DB schema from '${url}'`);
        this.master_schema = await this.fetchSchema(url);
        this.logger.debug(`Found DB found`);
        return true;
    }

    private async fetchSchema(url: string, cache: 'r' | 'rw' | 'w' = 'rw'): Promise<AnySchemaObject> {

        let response: Response;
        try {
            response = await fetch(url);
        } catch(error: any) {
            throw new Error(`Unable to fetch schema from '${url}'.\n'${error.message}'`);
        }

        if(!response.ok) throw new Error(`Unable to fetch schema from '${url}', reponse: ${JSON.stringify(response)}`);        

        const schema = (await response.json()).data;
        return schema;
    }

    /**
     * Will throw an exception in case the object does not respect a given schema.
     */
    validate_or_throw(obj: Partial<ICriptObject>, method: 'Patch' | 'Post' = 'Post'): boolean | never {
        let is_valid: boolean;
        let ref: CriptObjectRef;

        // 1- Determine which reference to use
        if( 'node' in obj ) {
            const type = obj.node?.at(0);
            if( !type ) {
                throw new Error(`The node type cannot be determined (node.node?.at(0) is undefined)`);
            }
            ref = `${type}${method}`;
        } else if( 'uuid' in obj) {
            ref = 'EdgeUUID';
        } else if( 'uid' in obj) {
            ref = 'Edge';
        } else {
            throw new Error(`Object is unknown and cannot be validated`);
        }

        // 2- Run validation against schema with a given ref
        if(ref) {
            is_valid = this.validate(ref, obj);
        } else {
            throw new Error(`Object is unknown and cannot be validated`);
        }

        // 3- Ensure data is valid
        if(!is_valid) {
            this.logErrors();
            let json = JSON.stringify(obj, null, '  ');
            const json_length_max = 1024;
            if( json.length > json_length_max ) {
                json = `${json.substring(0, json_length_max/2)}\n- - - - - (cut here, json is bigger than ${json_length_max} chars) - - - - -\n${json.substring(json.length-json_length_max/2)}`;
            }
            throw new Error(`Invalid '${ref}'\n JSON is:\n (${json})\n${this.errorsAsString()}`);
        }
        return is_valid;
    }

    /**
     * Validate a given node against a specific cript object reference.
     * Require the validator to be initialized first (by calling init()).
     */
    validate(ref: CriptObjectRef, node: Partial<ICriptObject>): boolean {
        // Check if the master schema is present
        if( this.master_schema === null) {
            throw new Error('schema is null. Did you called async init() ?');
        }
        // If needed, create a schema specific for the object type we want to validate
        const schema_ref = `#${ref}`;
        if( !this.ajv.getSchema(schema_ref)) {
            // Define which reference should be used by default
            const schema_copy = structuredClone(this.master_schema);
            schema_copy.$ref = `#/$defs/${ref}`;
            schema_copy.$id  = schema_ref;
            this.ajv.addSchema(schema_copy);
        }        
        this.logger.debug(`Validating object using schema '${schema_ref}' ...`);
        return this.ajv.validate(schema_ref, node);
    }

    logErrors(limit: number = Number.POSITIVE_INFINITY) {
        const errors = this.errorsAsString(limit);
        if(errors.length === 0) {
            return  this.logger.info(`No error found.`)
        }
        this.logger.error(errors);
    }

    errorsAsString(limit: number = Number.POSITIVE_INFINITY) {
        if ( !this.ajv.errors ) {
            return '';
        }
        const firstErrorsCount = Math.min(limit, this.ajv.errors.length);
        const firstErrors = this.ajv.errors.slice(0, firstErrorsCount);
        const errorsAsJSONString = JSON.stringify(firstErrors, null, '  ');
        return `First ${firstErrorsCount} error(s) found:\n${errorsAsJSONString}\nIn total, ${this.ajv.errors?.length} error(s) were found, see log above.`;
    }
}