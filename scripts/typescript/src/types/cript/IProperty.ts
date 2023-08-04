import { ICitation } from "./ICitation";
import { IComputation } from "./IComputation";
import { ICondition } from "./ICondition";
import { IData } from "./IData";
import { IMaterial } from "./IMaterial";

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
  component?: IMaterial[];
  method?: string;
  condition?: ICondition[];
  data?: IData[];
  computation?: IComputation[];
  citation?: ICitation[];
  created_at?: string;
  updated_at?: string;  
  uuid?: string;
  uid?: string;
}
