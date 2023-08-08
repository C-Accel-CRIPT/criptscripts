import { IIngredient, Edge, IReference, IProject } from "@cript";

/**
 * Optimized project structure.
 * 
 * Why? Some shared nodes cannot be stored in a project (Reference),
 * and need to be inserted prior to the project to be reused.
 */
export type OptimizedProject = {
  // Unique nodes shared by the project
  shared: {
    reference: IReference[];
  },
  // Project referencing children with Edge or EdgeUUID
  project: IProject;
}
 
/**
 * The role of this class is to reduce redundancy and ensure certain fields are properly defined.
 * It is designed to work with any CRIPT object, but primarly intended to be use with an IProject.
 * @example
 * const my_project: IProject = { ... };
 * const optimized = CriptGraphOptimizer.get_optimized(my_project);
 * // optimized.project
 */
export class CriptGraphOptimizer {
  enable_logs = false;
  // reference counter to assign unique ids during a session
  private next_uid = 0;
  // Set of already optimized uid
  private optimized_uid = new Set<string>();
  // Unique names
  private unique_names = new Set<string>();
  // They cannot be stored directly in a project to be reused.
  // They should be ingested first, and referenced using Edge or EdgeUUID by the Citations.
  private shared_references = new Map<string, IReference>();

  private debug(...args: any) {
    this.enable_logs && console.debug(args);
  }
  /**
   * Ensure node has a uid, if not assign a new uid
   */
  private register_node(node: any): void {
    if(node.uid) throw new Error("Node already has a uid, cannot be registered twice");

    const type = node.node[0];
    // ensure has a name
    switch( type ) {
      case 'Reference': // Reference has not a "name" it has a "title"   
        if(!node.title) node.title = `${type}_${this.next_uid++}`;
        break;
      default:   
        if(!node.name) node.name = `${type}_${this.next_uid++}`;
        break;
      case 'Ingredient': // Ingredient has no name and should not be reused
      case 'Citation':   // Citation has no name and should not be reused        
        return;
    }

    // ensure has a unique name/title
    const name_or_title =  node.name ??  node.title;
    if( name_or_title ) {
      if( this.unique_names.has(name_or_title) ) {
        throw new Error(`The name '${name_or_title}' is already in use.`);
      } else {
        this.unique_names.add(name_or_title);
        // temporary method for the backend to recognyze a reference
        node.uid = `_:${name_or_title}`;
      } 
    }

    // ensure has a name
    switch( type) {
      case 'Reference': // Reference has not a "name" it has a "title"   
        if(!node.title) node.title = `${type}_${this.next_uid++}`;
        // References must be stored in a shared container, outside of the project (which cannot handle them by design)
        if( this.shared_references.has(node.uid)) throw new Error(`Reference already exists in shared_references (uid: '${node.uid}')`);
        this.shared_references.set(node.uid, node);
        break;
      default:   
        if(!node.name) node.name = `${type}_${this.next_uid++}`;
        break;
      case 'Ingredient': // Ingredient has no name and should not be reused
      case 'Citation':   // Citation has no name and should not be reused        
        return;
    }
  };

  /**
   * Make an edge from a given node.
   * note: and Edge only has a uid (which is NOT a uuid).
   */
  make_edge(node: any): Edge {
    if (node === undefined) throw new Error("Unable to use a reference from an undefined node");
    if (node.uid === undefined) this.register_node(node);

    // Ensure the node has model_version (but won't be included in the reference)
    if (!node.model_version) {
      this.debug(`-- node (uid: ${node.uid}) has no model_version, fixing it DONE`);
      node.model_version = "1.0.0";
    }

    return {
      uid: node.uid
    };
  };

  /**
   * Convert a given node property to edges.
   */
  private convert_to_edges<T extends {[key: string]: any }, K extends keyof T>(node: T, key: K): void {
    const arr = node[key];
    if(arr && arr.length !== 0) {
      this.debug(`\tkey: ${key as string} ...`);
      (node[key] as any[]) = arr.map((node: any) => this.make_edge(node));
      this.debug(`\tkey: ${key as string} DONE`);
    }
  }

  private replacer(key: string, value: any): any {

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
      if(node.uid) this.optimized_uid.add(node.uid);

      this.debug(`-- Optimizing node (uid: "${node.uid}", type: "${type}", name: "${node.name}") ...`);

      // specific case on per-type basis
      switch (type) {
        case "Inventory":
          this.convert_to_edges(node, 'material');
          break;

        case 'Experiment':
          // keep data
          break;

        case 'Property':
        case 'Condition':
          this.convert_to_edges(node, 'data');
          this.convert_to_edges(node, 'computation');
          break;

        case 'Process':
          if(node.ingredient) {
            this.debug(`\tkey: ingredient ...`);
            node.ingredient = node.ingredient?.map( (each: IIngredient, index: number) => {
              return {
               ...each,
                material: each.material?.map((m: any) => this.make_edge(m))
              }
            })
            this.debug(`\tkey: ingredient DONE`);
          }
          this.convert_to_edges(node, 'data');
          break;

        case 'Project':
            // we want the full collection, material and file arrays
            break;
      }
    }

    // Some keys always require to be references
    switch (key) {
      
      // Arrays
      
      case "prerequisite_process":
      case "waste":
      case "product":
      case "component":
      case "input_data":
      case "output_data":
        if(value) {
          this.debug(`\tkey: ${key} ...`);
          value = value.map((v: any ) => this.make_edge(v));
          this.debug(`\tkey: ${key} DONE`);
        }
        break;
      
      // Single value

      case "citation":
        // Reference will be moved to the shared_references, and a simple Edge will be set for node.reference
        if (value) value = value.map( v => {
          v.reference = this.make_edge(value);
          return v
        })
        break;
    }

    if( type ) {
      // create alias
      const node = value;
      this.debug(`-- Optimizing node (uid: "${node.uid}", type: "${type}", name: "${node.name}") DONE`);
    }

    return value;
  };

  private optimize_recursively(key: string, value: any): any {
    if( value === null) {
      return value;
    }
    if( typeof value === 'object' ) {
      // Replaces each object's property recursively
      for(let _key of Object.keys(value).values() ) {
        value[_key] = this.optimize_recursively(_key, this.replacer(_key, value[_key]));
      }
      return value;
    } 
    return this.replacer(key, value);
  }
  /**
   * Optimize a given cript object
   * - uses Edge or EdgeUUID when possible
   * - criptObject not changed (a deep copy is made)
   */
  get_optimized(criptObject: IProject): OptimizedProject {
    this.reset_state();

    // Generate an optimized structure
    const criptObjectCopy = structuredClone(criptObject);
    const result: OptimizedProject = {
      shared: {
        reference: [...this.shared_references.values()],
      },
      project: this.optimize_recursively('', criptObjectCopy)
    }

    // Warn user in case no references are present
    if( result.shared.reference.length === 0 ) {
      this.debug(`No shared references found`);
    }

    return result;
  }

  reset_state() {
    this.optimized_uid.clear();
    this.unique_names.clear();
    this.shared_references.clear();
  }
}
