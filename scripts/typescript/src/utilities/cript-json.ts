import { IIngredient } from "@cript";
import * as JSONStream from 'jsonstream-ts';
import * as stream from 'stream';

type Replacer = ((this: any, key: string, value: any) => any) | undefined;
type NodeReference = { uid: string, node: [string]};

/**
 * JSON serializer specific to CRIPT to reduce redundancy and ensure certain fields are properly defined
 */
export class CriptJSON {
  static logs = false;
  // reference counter to assign unique ids during a session
  private static next_uid = 0;
  // Set of already optimized uid
  private static optimized_uid = new Set<string>();

  private static debug(...args: any) {
    this.logs && console.debug(args);
  }
  /**
   * Ensure node has a uid, if not assign a new uid
   */
  private static register_node(node: any): void {
    if(node.uid) throw new Error("Node already has a uid, cannot be registered twice");

    // ensure has a unique name
    if(!node.name) {
      node.name = `${node.node[0]}_${this.next_uid++}`;
    } else {
      node.name = `${node.name}_${this.next_uid++}`;
    }
    // temporary method for the backend to recognyze a reference
    node.uid = `_:${node.name}`;
  };

  /**
   * return a reference to the node instead of the full node
   */
  private static node_as_reference = (node: any): NodeReference => {
    if (node === undefined) throw new Error("Unable to use a reference from an undefined node");
    if (node.uid === undefined) this.register_node(node);

    // Ensure the node has model_version (but won't be included in the reference)
    if (!node.model_version) {
      this.debug(`-- node (uid: ${node.uid}) has no model_version, fixing it DONE`);
      node.model_version = "1.0.0";
    }

    return {
      uid: node.uid,
      node: node.node,
    };
  };

  private static array_property_as_reference = <T extends {[key: string]: any }, K extends keyof T>(node: T, key: K): void => {
    const arr = node[key];
    if(arr && arr.length !== 0) {
      this.debug(`\tkey: ${key as string} ...`);
      (node[key] as any[]) = arr.map(this.node_as_reference);
      this.debug(`\tkey: ${key as string} DONE`);
    }
  }

  private static replacer: Replacer = (key: string, value: any): any => {

    /** optimize if value is a node */
    const type: string | undefined = value?.node?.at(0);
    if (type) {
      
      // create alias
      const node = value;
  
      // return early if already optimized
      switch (type) {
        case 'Property':
        case 'Condition':
          // those nodes cannot be shared, no need to be registered
          break
        default:
          // Ensure is registered
          if (node.uid === undefined) this.register_node(node);                  
      }
      if(this.optimized_uid.has(node.uid)) return node; 
      this.optimized_uid.add(node.uid);

      this.debug(`-- Optimizing node (uid: "${node.uid}", type: "${type}", name: "${node.name}") ...`);

      // specific case on per-type basis
      switch (type) {
        case "Inventory":
          this.array_property_as_reference(node, 'material');
          break;

        case 'Experiment':
          // keep data
          break;

        case 'Property':
        case 'Condition':
          this.array_property_as_reference(node, 'data');
          this.array_property_as_reference(node, 'computation');
          break;

        case 'Process':
          if(node.ingredient) {
            this.debug(`\tkey: ingredient ...`);
            node.ingredient = node.ingredient?.map( (each: IIngredient, index: number) => {
              return {
               ...each,
                material: each.material?.map(this.node_as_reference)
              }
            })
            this.debug(`\tkey: ingredient DONE`);
          }
          this.array_property_as_reference(node, 'data');
          break;

        case 'Material':
          this.array_property_as_reference(node, 'component');
          break;

        case 'Project':
            // we want the full collection, material and file arrays
            break;
      }
    }

    // Some keys always require to be references
    switch (key) {
      case "prerequisite_process":
      case "waste":
      case "product":
      case "component":
      case "input_data":
      case "output_data":
        if(value) {
          this.debug(`\tkey: ${key} ...`);
          value = value.map(this.node_as_reference);
          this.debug(`\tkey: ${key} DONE`);
        }
        break;
    }

    if( type ) {
      // create alias
      const node = value;
      this.debug(`-- Optimizing node (uid: "${node.uid}", type: "${type}", name: "${node.name}") DONE`);
    }

    return value;
  };

  /**
   * Stringify a value as a string using JSON.stringify
   * Works well on small objects, use stringifyAsStream in case you have issues.
   */
  static stringify(value: any, space: string | number | undefined = undefined): string {
    this.optimized_uid.clear();
    return JSON.stringify(value, this.replacer, space);
  }

  /**
   * Stringify value as a stream
   * Each fields of value will be serialized into outStream
   */
  static stringifyAsStream(outStream: stream.Writable, value: Record<string, any>, space: string | number | undefined = undefined,): void {

    this.optimized_uid.clear();
    
    // hack (install)
    // JSONStream does not allow to specify a replacer (like JSON.stringify offers)
    const stringify_original =  JSON.stringify;
    JSON.stringify = (value: any, replacer, indent) => stringify_original(value, this.replacer, indent)

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
