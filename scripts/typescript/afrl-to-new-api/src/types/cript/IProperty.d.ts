import { ICondition, IMaterial } from './.';

export interface IProperty {
  readonly node: ['Property'];
  key: string;
  type: string;
  value: number;
  unit: string;
  uncertainty: string;
  uncertainty_type: string; //UncertainityType
  sample_preparation: string;
  notes: string;
  structure: string;
  component: IMaterial[];
  method: string;
  condition: ICondition[];
  data: IData[];
  computation: IComputation[];
  citation: []; // IReference //ReferencePost
  created_at: string;
  updated_at: string;
  model_version: string;
  uuid: string;
  uid: string;
}
