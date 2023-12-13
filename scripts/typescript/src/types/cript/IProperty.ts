import { Edge, EdgeUUID } from "@cript";
import { ICitation } from "./ICitation";
import { IComputation } from "./IComputation";
import { ICondition } from "./ICondition";
import { IData } from "./IData";
import { IMaterial } from "./IMaterial";
import { EdgeUID } from "./Edges";

export interface IProperty {
  readonly node: ['Property'];
  model_version?: string;
  key: string;
  type: string;
  value: string  | number;
  unit: string | null;
  uncertainty?: number;
  uncertainty_type?: string;
  sample_preparation?: string;
  notes?: string;
  structure?: string;
  component?: EdgeUUID[] | EdgeUID[];
  method?: string;
  condition?: ICondition[];
  data?: EdgeUUID[] | EdgeUID[];
  computation?: IComputation[];
  citation?: ICitation[] | EdgeUUID[];
  created_at?: string;
  updated_at?: string;  
  uuid?: string;
  uid?: string;
}
