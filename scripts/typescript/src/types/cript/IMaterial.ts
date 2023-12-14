import { IProject } from './IProject';
import { IProperty } from './IProperty';
import { EdgeUID, EdgeUUID } from "./Edges";


export interface IComputationalForcefield {}
export interface IMaterial {
  readonly node: ['Material'];
  created_at?: string;
  locked?: boolean;
  model_version?: string;
  name: string;
  names?: string[];
  notes?: string;
  public?: boolean;
  uid?: string;
  updated_at?: string;
  uuid?: string;
  project?: IProject[];
  keyword?: string[];
  parent_material?: string;
  property?: IProperty[];
  property_count?: number;  
  component?: EdgeUUID[] | EdgeUID[];
  component_count?: number;
  computational_forcefield?: IComputationalForcefield;
  identifier_count?: number;
  bigsmiles?: string;
  smiles?: string;
  inchi?: string;
  inchi_key?: string;
  mol_form?: string;
  pubchem_cid?: number;  
  chem_formula?: string;
  // a.k.a CAS number
  chemical_id?: string;
}
