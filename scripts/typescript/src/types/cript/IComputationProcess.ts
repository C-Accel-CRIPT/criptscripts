import { ICondition, IData, IReference, ISoftwareConfiguration, ICitation, IExperiment, IIngredient, IProperty } from './index';

/**
 * A computational_process is a simulation that processes or changes a virtual material.
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=13
 */
export interface IComputationProcess {
  readonly node: ['ComputationProcess'];
  uid: string;
  uuid: string;
  type: string;
  citation?: ICitation[];
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
  software_configuration?: ISoftwareConfiguration[];
  experiment?: IExperiment[];
  ingredient?: IIngredient[];
  property?: IProperty[];
}
