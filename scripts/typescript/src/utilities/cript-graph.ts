import { EdgeUUID, IProject } from "@cript";
import * as UUID from 'uuid';

/**
 * Set of methods related to CriptGraph.
 * Provide functions to assign uuid or generate EdgedUUID to/from a given node
 */
export namespace CriptGraph {

  function set_default_value<T>(obj: T, key: keyof T, value: any): T {
    if (obj[key] === undefined) {
      obj[key] = value;
    }
    return obj;
  }

  export function has_uuid(node: any): node is { uuid: string } {
    return 'uuid' in node && node.uuid !== undefined;
  }

  /**
   * Make a new UUID
   */
  export function make_uuid(): string {
    return UUID.v4();
  }


  /**
   * Make an edge to an already registered node.
   * Prior to make and edge, use register_node() to add a node to the register.
   * @param node must have an uuid and be present in uids Set
   */
  export function make_edge(node: any): EdgeUUID {
    if ( !has_uuid(node) ) throw new Error("Node should have an uuid to be converted to an EdgeUUID");
    return { uuid: node.uuid }
  }

  export function is_edge(node: any): node is EdgeUUID {
    return typeof node === 'object' && (Object.keys(node).length === 1) && 'uuid' in node;
  }

  /**
   * Traverse recursively a given project and ensure a given node (identified by its uuid)
   * is kept full only once. Any usage of a node already traversed is converted to an EdgeUUID.
   * Note that project will be deep copied to be turned cycle-free.
   * @param project
   */
  export function optimize_project(project: IProject): IProject {
    // Ensure our object is cycle-free
    const project_cycle_free = JSON.parse( JSON.stringify(project) );
    // To store the uuid during traversal
    const traversed = new Set<string>();

    const optimize_recursively = <T>(value: T): T | EdgeUUID | EdgeUUID[] => {

      if( !value || typeof value !== 'object' ) {
        return value;
      }

      // Handle recursive call for arrays

      if( Array.isArray(value) ) {
        return value.map( optimize_recursively );
      }

      // Handle objects

      if( is_edge(value) ) {
        return value;
      }

      if( has_uuid(value) ) {
        if( traversed.has(value.uuid) ) {
          return make_edge(value);
        }
        traversed.add(value.uuid); // Set traversed before to do the recursive call to avoid issues with back-references
      }

      Object.keys(value).forEach( key => {
        value[key] = optimize_recursively(value[key]);
      })

      return value;
    }

    return optimize_recursively(project_cycle_free);
  }

}
