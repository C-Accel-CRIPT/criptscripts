import { IIngredient, Slug } from "@cript";

type Replacer = ((this: any, key: string, value: any) => any) | undefined;
type NodeReference = { uid: string, node: [string]};

/**
 * JSON serializer specific to CRIPT to reduce redundancy and ensure certain fields are properly defined
 */
export class CriptJSON {
  // reference counter to assign unique ids during a session
  private static next_uid = 0;
  // Set of already optimized uid
  private static optimized_uid = new Set<string>();

  /**
   * Ensure node has a uid, if not assign a new uid
   */
  private static register_node(node: any): void {
    if(node.uid) throw new Error("Node already has a uid, cannot be registered twice")
    node.uid = `${this.next_uid++}`;
  };

  /**
   * return a reference to the node instead of the full node
   */
  private static node_as_reference = (node: any): NodeReference => {
    if (node === undefined) throw new Error("Unable to use a reference from an undefined node");
    if (node.uid === undefined) this.register_node(node);

    // Ensure the node has model_version (but won't be included in the reference)
    if (!node.model_version) {
      console.debug(`-- node (uid: ${node.uid}) has no model_version, fixing it DONE`);
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
      console.debug(`\tkey: ${key as string} ...`);
      (node[key] as any[]) = arr.map(this.node_as_reference);
      console.debug(`\tkey: ${key as string} DONE`);
    }
  }

  private static replacer: Replacer = (key: string, value: any): any => {

    /** optimize if value is a node */
    const type: string | undefined = value?.node?.at(0);
    if (type) {
      
      // create alias
      const node = value;
      
      // Ensure is registered
      if (node.uid === undefined) this.register_node(node);

      // return early if already optimized
      if(this.optimized_uid.has(node.uid)) return value;
      this.optimized_uid.add(node.uid);

      console.debug(`-- Optimizing node (uid: "${node.uid}", type: "${type}", name: "${node.name}") ...`);

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
            console.debug(`\tkey: ingredient ...`);
            node.ingredient = node.ingredient?.map( (each: IIngredient, index: number) => {
              return {
               ...each,
                material: each.material?.map(this.node_as_reference)
              }
            })
            console.debug(`\tkey: ingredient DONE`);
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
          console.debug(`\tkey: ${key} ...`);
          value = value.map(this.node_as_reference);
          console.debug(`\tkey: ${key} DONE`);
        }
        break;
    }

    if( type ) {
      // create alias
      const node = value;
      console.debug(`-- Optimizing node (uid: "${node.uid}", type: "${type}", name: "${node.name}") DONE`);
    }

    return value;
  };

  static stringify(value: any, space: string | number | undefined = undefined): string {
    this.optimized_uid.clear();
    return JSON.stringify(value, this.replacer, space);
  }
}
