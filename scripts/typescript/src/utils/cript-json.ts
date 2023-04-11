import { IIngredient, Slug } from "@cript";

type Replacer = ((this: any, key: string, value: any) => any) | undefined;

// reference counter to assign unique ids during a session
let ref_counter = 0;

/**
 * Ensure node has a uid, if not assign a new uid
 */
const register_node = (node: any) => {
  if(node.uid) throw new Error("Node already has a uid, cannot be registered twice")
  node.uid = `${ref_counter++}`;
};

/**
 * return a reference to the node instead of the full node
 */
const as_reference = (node: any): { uid: string, node: [string]} => {
  if (node === undefined) throw new Error("Unable to use a reference from an undefined node");
  if (node.uid === undefined) register_node(node);

  // Ensure the node has model_version (but won't be included in the reference)
  if (!node.model_version) {
    console.debug(`Fixing missing model_version on referenced node (uid: ${node.uid})`);
    node.model_version = "1.0.0";
  }

  return {
    uid: node.uid,
    node: node.node,
  };
};

/**
 * JSON serializer specific to CRIPT to reduce redundancy and ensure certain fields are properly defined
 */
export class CriptJSON {
  private static optimized = new Set<string>();

  private static replacer: Replacer = (key: string, value: any): any => {

    /** optimize if value is a node */
    const type: string | undefined = value?.node?.at(0);
    if (type) {
      
      // create alias
      const node = value;
      
      // Ensure is registered
      if (node.uid === undefined) register_node(node);

      // return early if already optimized
      if(this.optimized.has(node.uid)) return value;
      this.optimized.add(node.uid);

      console.debug(`Optimizing node (uid: "${node.uid}", type: "${type}", name: "${node.name}") ...`);

      // specific case on per-type basis
      switch (type) {
        case "Inventory":
          if (node.material) {
            console.debug(`-- Optimizing the materials`);
            node.material = node.material.map(as_reference);
          }
          break;

        case 'Experiment':
          // keep data
          break;
        case 'Process':
          node.ingredient = node.ingredient?.map( (each: IIngredient, index: number) => {
            console.debug(`-- Optimizing ingredient.material #${index}`);
            return {
              ...each,
              material: each.material?.map(as_reference)
            }
          })
          break;
        case 'Project':
            // we want the full collection, material and file arrays
            break;
        default:
          if (node.data) {
            console.debug(`-- Optimizing the data`);
            node.data = node.data.map(as_reference);
          }
          break;
      }
    }

    // Some keys always require to be references
    switch (key) {
      case "prerequisite_process":
      case "waste":
      case "product":
        console.debug(`-- Optimizing ${key} ..."`);
        value = value.map(as_reference);
        break;
    }

    // pass through
    return value;
  };

  static stringify(value: any, space: string | number | undefined = undefined): string {
    this.optimized.clear();
    return JSON.stringify(value, this.replacer, space);
  }
}
