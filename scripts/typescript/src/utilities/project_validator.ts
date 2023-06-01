import { IProject } from "@cript";
import Ajv, { AnySchemaObject, Options } from "ajv";
import addFormats from "ajv-formats"

// TODO: consider using env var
const CRIPT_SCHEMA_URL = 'https://development.api.mycriptapp.org/api/v1/schema';

/**
 * Simple class to validate a CRIPT Project
 */
export class ProjectValidator {
    
    private ajv: Ajv;

    constructor(options: Options = {
        allErrors: true,
    }) {
        this.ajv = new Ajv(options);
        addFormats(this.ajv); // for "date-time"
    }

    private async fetchSchema(url = CRIPT_SCHEMA_URL): Promise<AnySchemaObject> {
        const response = await fetch(url)
        if(!response.ok) throw new Error('Unable to fetch schema');

        const schema = (await response.json()).data;

        // HACK: schema includes wrong keys such as "item" (instead of "items")
        const schema_as_string = JSON.stringify(schema);
        const fixed_schema_as_string = schema_as_string.replaceAll('"item":', '"items":');

        return JSON.parse(fixed_schema_as_string);
    }

    async validate(type: 'ProjectPost' | 'ProjectPatch', project: IProject): Promise<any> {
        const schema = await this.fetchSchema();
        schema['$ref'] = `#/$defs/${type}`;
        await this.ajv.validate(schema, project);
    }

    errorsText() {
       return this.ajv.errorsText();
    }
}