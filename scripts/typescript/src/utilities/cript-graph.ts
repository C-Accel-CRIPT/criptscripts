import { EdgeUUID, IProject } from "@cript";
import * as UUID from 'uuid';
import { EdgeUID } from "../types/cript/Edges";

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

  export function has_uuid(node: any): node is EdgeUUID {
    return 'uuid' in node && node.uuid !== undefined;
  }

  export function has_uid(node: any): node is EdgeUID {
    return 'uid' in node && node.uid !== undefined;
  }

  /**
   * Make a new UUID
   */
  export function make_uuid(): string {
    return UUID.v4();
  }

  /**
   * Make a new UID
   * "_:xxxxxxxx"
   */
  export function make_uid(): string {
    return `_:${UUID.v4()}`;
  }

  /**
   * Make an edge to an already registered node.
   * @param node must have an uuid and be present in uids Set
   */
  export function make_edge_uuid(node: any): EdgeUUID {
    if ( !has_uuid(node) ) throw new Error("Node should have an uuid to be converted to an EdgeUUID");
    return { uuid: node.uuid }
  }

  /**
   * Make an edge to an already registered node.
   * @param node must have an uid and be present in uids Set
   */
  export function make_edge_uid(node: any): EdgeUID {
    if ( !has_uid(node) ) throw new Error("Node should have an uid to be converted to an EdgeUID");
    return { uid: node.uid }
  }

  export function is_edge_uuid(node: any): node is EdgeUUID {
    return typeof node === 'object' && (Object.keys(node).length === 1) && 'uuid' in node;
  }

  export function is_edge_uid(node: any): node is EdgeUID {
    return typeof node === 'object' && (Object.keys(node).length === 1) && 'uid' in node;
  }

  /**
   * Traverse recursively a given project and ensure a given node (identified by its uuid)
   * is kept full only once. Any usage of a node already traversed is converted to an EdgeUUID.
   * Note that project will be deep copied to be turned cycle-free.
   * @param project
   * @param method to determine how links should be handled
   */
  export function optimize_project(project: IProject, method: 'make-edge-uid' | 'make-edge-uuid' | 'always-full-node'): IProject {
    // Ensure our object is cycle-free
    const project_cycle_free = JSON.parse( JSON.stringify(project) );
    // To store the uuid during traversal
    const traversed = new Set<string>();

    const optimize_recursively = <T>(value: T): T | EdgeUUID | EdgeUID | EdgeUUID[] | EdgeUID[] => {

      if( !value || typeof value !== 'object' ) {
        return value;
      }

      // Handle recursive call for arrays

      if( Array.isArray(value) ) {
        return value.map( optimize_recursively );
      }

      // Handle objects

      if( is_edge_uid(value) || is_edge_uuid(value) ) {
        return value;
      }

      switch ( method ) {
        case "make-edge-uuid":
          if( has_uuid(value) && method === 'make-edge-uuid' ) {

            if( traversed.has(value.uuid) ) {
              return make_edge_uuid(value);
            }
            traversed.add(value.uuid);

          }
          break;

        case "make-edge-uid":
          if( has_uid(value)) {

            if( traversed.has(value.uid) ) {
              return make_edge_uid(value);
            }
            traversed.add(value.uid);
          }
          break
      }

      Object.keys(value).forEach( key => {
        value[key] = optimize_recursively(value[key]);
      })

      return value;
    }

    return optimize_recursively(project_cycle_free);
  }

}
