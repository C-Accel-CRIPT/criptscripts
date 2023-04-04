import { ICollection, IComputation, IComputationProcess, IData, IMaterial, IProcess } from '.';

export interface IExperiment {
  computation_count: number;
  computation?: IComputation[];
  computation_process_count: number;
  computation_process?: IComputationProcess[];
  created_at: string;
  data?: IData[];
  data_count: number;
  locked: boolean;
  material?: IMaterial[];  // this field is not implemented on the new API, but was present in the legacy API and is used in this project.
  material_count?: number; // TODO: remove auestion mark once new API adds the field.
  model_version: string;  
  name: string;
  notes: string;
  process?: IProcess[];
  process_count: number;
  public: boolean;
  uid: string;
  updated_at: string;
  uuid: string;
  collection: ICollection[];
  readonly node: 'Experiment';
}
