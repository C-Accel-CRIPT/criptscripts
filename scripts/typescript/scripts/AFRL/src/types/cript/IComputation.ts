import { ICondition, IReference, IData, ISoftwareConfiguration, IExperiment, IIngredient, IProperty } from './index';

/**
 * "The computation node describes the transformation of data or the creation of a computational data set (...)"
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=11
 */
export interface IComputation {
  readonly node: ['Computation'];
  uid: string;
  uuid: string;
  citation?: IReference[];
  condition?: ICondition[];
  model_version: string;
  created_at: string;
  updated_at: string;
  input_data?: IData[];
  output_data?: IData[];
  locked: boolean;
  public: boolean;
  name: string;
  notes: string;
  prerequisite_computation?: IComputation;
  software_configuration?: ISoftwareConfiguration[];
  type: string;
  experiment?: IExperiment[];
}
