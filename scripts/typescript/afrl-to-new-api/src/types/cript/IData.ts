import { IComputation, IExperiment, IFile, IMaterial, IProcess } from '.';

export interface IData {
  readonly node: 'Data';
  name: string;
  notes: string;
  type: string;
  uid: string;
  uuid: string;
  file: IFile[];
  file_count: number;
  experiment?: IExperiment[];
  citation: []; // ICitation or ReferencePost
  citation_count: number;
  computation_process: []; //IComputationProcess
  computation_process_count: number;
  process: IProcess[];
  process_count: number;
  computation: IComputation[];
  computation_count: number;
  created_at: string;
  updated_at: string;
  locked: boolean;
  public: boolean;
  material?: IMaterial[];
  material_count: number;
  model_version: string;
  sample_preparation: string;
}
