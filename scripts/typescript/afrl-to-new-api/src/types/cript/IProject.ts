import { ICollection, IFile, IMaterial } from '.';

export interface IProject {
  model_version: string,
  collection: ICollection[];
  collection_count: number;
  created_at: string;
  material_count: number;
  material: IMaterial[];
  file: IFile[];
  file_count: number;
  name: string;
  notes: string;
  public: boolean;
  uid: string;
  updated_at: string;
  uuid: string;
  readonly node: 'Project';
}
