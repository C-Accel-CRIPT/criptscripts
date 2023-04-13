import { IData } from './index';

export interface ICondition {
  readonly node: ['Condition'];
  data?: IData[];
  created_at?: string;
  updated_at?: string;
  descriptor?: string;
  key: string;
  measurement_id?: number;
  model_version?: string;
  set_id?: number;
  type?: string;
  uncertainty?: string;
  uncertainty_type?: string;
  unit?: string;
  uuid?: string;
  value: string;
}
