import { ICondition, IExperiment, IIngredient, IMaterial, ICitation, IProperty, IEquipment } from '.';

export interface IProcess {
  readonly node: 'Process';
  experiment?: IExperiment[];

  created_at: string;
  description: string;
  keyword?: string[];
  locked: boolean;
  model_version: string;
  name: string;
  notes: string;
  public: boolean;
  type: string;
  updated_at: string;
  uid: string;
  uuid: string;
  prerequisite_process?: IProcess[];
  prerequisite_process_count: number;
  product?: IMaterial[];
  product_count: number;
  waste?: IMaterial[];
  waste_count: number;

  // property: {
  //   items: {
  //     $ref: 'PropertyPostProcess';
  //   };
  //   type: 'array';
  // };
  property?: IProperty[];
  property_count: number;

  equipment?: IEquipment[];
  equipment_count: number;

  citation?: ICitation[];
  citation_count: number;

  condition?: ICondition[];
  condition_count: number;

  ingredient?: IIngredient[];
  ingredient_count: number;
}
