import { IExperiment, IInventory, IProject } from '.';

export interface ICollection {
  locked?: boolean;
  model_version?: string;
  name: string;
  notes?: string;
  readonly node: ['Collection'];
  public?: boolean;
  uid?: string;
  uuid?: string;
  experiment?: IExperiment[];
  experiment_count?: number;
  inventory?: IInventory[];
  project?: IProject[];
  inventory_count?: number;
  created_at?: string;
  updated_at?: string;
  doi?: string;
}
