import * as JSONStream from 'jsonstream-ts';
import * as stream from 'stream';

/**
 * JSON serializer specific to CRIPT to reduce redundancy and ensure certain fields are properly defined
 */
export class CriptJSON {
  /**
   * Stringify a value as a string using JSON.stringify
   * Works well on small objects, use stringifyAsStream in case you have issues.
   */
  static stringify(value: any, space: string | number | undefined = undefined): string {
    return JSON.stringify(value, null, space);
  }

  /**
   * Stringify value as a stream
   * Each fields of value will be serialized into outStream
   */
  static stringifyAsStream(outStream: stream.Writable, value: Record<string, any>, space: string | number | undefined = undefined,): void {

    console.warn(`It looks like this function has issues, prefer using stringify(). \n It appeared that the JSON is uncomplete, needs to be investigated. \n The initial purpose of this function was to use streams insted of strings, but it is not necessary for small sized JSON.`)
    
    // hack (install)
    // JSONStream does not allow to specify a replacer (like JSON.stringify offers)
    const stringify_original =  JSON.stringify;
    JSON.stringify = (value: any, replacer, indent) => stringify_original(value, null, indent)

    // start to stream an object
    const transformStream: stream.Transform = JSONStream.stringifyObject('{', ',', '}', space);
    transformStream.pipe(outStream);

    // Stringify each field one by one
    Object
      .entries(value)
      .forEach( entry => {
        transformStream.write(entry, undefined, (error) => process.stdout.write(error?.message ?? 'Unknown error'));
        // console.log(entry)
      });
    transformStream.end();

    // hack (uninstall)
    JSON.stringify = stringify_original;
  }
}
