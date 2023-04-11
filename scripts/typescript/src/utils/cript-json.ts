import { IIngredient, Slug } from "@cript";

type Replacer = ((this: any, key: string, value: any) => any) | undefined;

let ref_counter = 0;

const register_node = (node: any) => {
  if (!node.uid) node.uid = `${ref_counter++}`;
};
const as_reference = (node: any) => {
  if (node === undefined) throw new Error("Unable to use a reference from an undefined node");
  if (node.uid === undefined) register_node(node);
  return {
    uid: node.uid,
    node: node.node,
  };
};

/**
 * JSON serializer specific to CRIPT to reduce redundancy and ensure certain fields are properly defined
 */
export class CriptJSON {
  private static replacer: Replacer = (key: string, value: any): any => {

    /** optimize if value is a node */
    const type: string | undefined = value?.node?.at(0);
    if (type) {
      // create alias
      const node = value;

      // Ensure is registered
      if (node.uid === undefined) register_node(node);

      // Ensure has model_version
      /*
      if (!node.model_version) {
        console.log(`Fixing missing model_version for ${type}: "${node.uid}"`);
        node.model_version = "1.0.0";
      }*/

      switch (type) {
        case "Inventory":
          if (node.material) {
            console.log(`Optimizing the materials of the ${type} #${key}...`);
            node.material = node.material.map(as_reference);
          }
          break;

        case 'Experiment':
          // keep data
          break;
        case 'Process':
          node.ingredient = node.ingredient?.map( (each: IIngredient) => {
            return {
              ...each,
              material: each.material?.map(as_reference)
            }
          })
          break;
        default:
          if (node.data) {
            console.log(`Optimizing the data of the ${type} #${key}...`);
            node.data = node.data.map(as_reference);
          }
          break;
      }
    }

    /** Always optimize those keys */
    switch (key) {
      case "prerequisite_process":
      case "waste":
      case "product":
        console.log(`Optimizing ${key}...`);
        value = value.map(as_reference);
        break;
    }

    // pass through
    return value;
  };

  static stringify(value: any, space: string | number | undefined = undefined): string {
    return JSON.stringify(value, this.replacer, space);
  }
}
