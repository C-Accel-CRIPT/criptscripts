import { IIngredient, Edge, IProject, ICriptObject } from "@cript";
import * as console from "console";

type Options = {
  enable_logs: boolean;
  /** When true, the optimizer will remove duplicates by inserting Edges instead of full nodes */
  enable_edges: boolean;
}

/**
 * The role of this class is to reduce redundancy and ensure certain fields are properly defined.
 * It is designed to work with any CRIPT object, but primarily intended to be used with an IProject.
 * @example
 * const my_project: IProject = { ... };
 * const optimized = CriptGraphOptimizer.get_optimized(my_project);
 * // optimized.project
 */
export class CriptGraphOptimizer {
  static defaultOptions: Options = Object.freeze({
    enable_edges: true,
    enable_logs: false,
  })
  private options: Options;
    // reference counter to assign unique ids during a session
  private next_uid = 0;
  // Set of already optimized uid
  private optimized_uid = new Set<string>();
  // All the processed uids
  private uids = new Set<string>();

  constructor( options: Partial<Options> = {}) {
    this.options = {
      ...structuredClone(CriptGraphOptimizer.defaultOptions),
      ...structuredClone(options)
    }
  }
  private debug(...args: any) {
    this.options.enable_logs && console.debug(args);
  }

  /**
   * Check whether a node is already registered.
   */
  private has_uid(node: any): node is Edge {
    return 'uid' in node && node.uid !== undefined;
  }

  /**
   * Register a node.
   * @param node should not have an uid yet.
   */
  private register_node(node: any): any | never {
    if( this.has_uid(node) ) throw new Error("Node already has a uid, cannot be registered twice");

    const type = node.node[0];

    // Skip nodes that should not be reused
    switch( type ) {
      case 'Ingredient': // Ingredient has no name and should not be reused
      case 'Citation':   // Citation has no name and should not be reused        
        return;
    }

    // make a uid
    node.uid = `_:${this.next_uid++}`;
    if( this.uids.has(node.uid) ) {
      throw new Error(`The uid '${node.uid}' is already in use.`);
    }
    this.uids.add(node.uid);

    // ensure has model_version
    if (!node.model_version) {
      this.debug(`-- node (uid: ${node.uid}) has no model_version, fixing it DONE`);
      node.model_version = "1.0.0";
    }

    // ensure has a name
    switch( type) {
      case 'Reference': // Reference has a "title" instead of "name".
        if(!node.title) node.title = `${type}_${this.next_uid++}`;
        break;
      default:   
        if(!node.name) node.name = `${type}_${this.next_uid++}`;
    }
    return node;
  };

  /**
   * Depending on options, return the node (making sure it has an uid and model_version) or make an Edge (only has an uid)
   */
  reference_node<T extends {}>(node: T): T | Edge {
    if (node === undefined) throw new Error("Unable to reference an undefined node");

    // Ensure node is registered
    // We consider a node as registered when an uid property is present and defined
    // See register_node() for more info.
    if ( !this.has_uid(node) || !this.uids.has(node.uid) ) {
      // If we pass here, it means that's the first time we deal with this node. In such case we return the full node.
      // Why? Because we have to upload at least the full node once, otherwise the Edge will point to nothing.
      // BTW, some nodes cannot be stored in a shared array (e.g. References).
      return this.register_node(node);
    }

    // return early if node is an edge, or make an edge if options allows it.
    if ( this.is_edge(node) ) {
      return node;
    } else if( this.options.enable_edges ) {
      return this.make_edge(node);
    }

    // Otherwise return the full node
    return node;
  };


  /**
   * Make an edge to an already registered node.
   * Prior to make and edge, use register_node() to add a node to the register.
   * @param node must have an uid and be present in uids Set
   */
  private make_edge<T extends {}>(node: T): Edge {
    if (node === undefined) throw new Error("Cannot make an edge to an undefined node");
    if ( !this.has_uid(node)) throw new Error("Node require an uid to make an edge to");
    if ( !this.uids.has(node.uid) ) throw new Error("Node require to be registered in this.uids");
    return { uid: node.uid }
  }

  private is_edge(node: any): node is Edge {
    return (Object.keys(node).length === 1) && 'uid' in node;
  }

  /**
   * Reference an array of nodes at a given key.
   * Nodes might be converted to edges depending on options
   */
  private reference_nodes_at_key<T extends {[key: string]: any }, K extends keyof T>(node: T, key: K): void {
    const arr = node[key];
    if(arr && arr.length !== 0) {
      this.debug(`\tkey: ${key as string} ...`);
      (node[key] as any[]) = arr.map((node: any) => this.reference_node(node));
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
          this.reference_nodes_at_key(node, 'material');
          break;

        case 'Experiment':
          // keep data
          break;

        case 'Property':
        case 'Condition':
          this.reference_nodes_at_key(node, 'data');
          this.reference_nodes_at_key(node, 'computation');
          break;

        case 'Process':
          if(node.ingredient) {
            this.debug(`\tkey: ingredient ...`);
            node.ingredient = node.ingredient?.map( (each: IIngredient) => {
              return {
               ...each,
                material: each.material?.map((m: any) => this.reference_node(m))
              }
            })
            this.debug(`\tkey: ingredient DONE`);
          }
          this.reference_nodes_at_key(node, 'data');
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
          value = value.map((v: any ) => this.reference_node(v));
          this.debug(`\tkey: ${key} DONE`);
        }
        break;
      
      // Single value

      case "citation":
        // Reference will be moved to the shared_references, and a simple Edge will be set for node.reference
        if (value) value = value.map( _citation => {
          _citation.reference = this.reference_node(_citation.reference);
          return _citation;
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
   * - uses Edge or EdgeUUID (if options.enable_edges is true)
   * - A deep copy of project is made, original object remains untouched.
   * @param project a project to optimize
   */
  get_optimized(project: IProject): IProject {
    this.reset_state();
    // Generate an optimized structure
    return this.optimize_recursively('', structuredClone(project));
  }

  reset_state() {
    this.optimized_uid.clear();
    this.uids.clear();
  }
}
