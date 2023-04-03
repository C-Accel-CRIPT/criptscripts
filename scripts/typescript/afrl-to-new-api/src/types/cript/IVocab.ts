/**
 * Define the type of any vocabulary data
 */
export interface IVocab {
  [key: string]: (IVocabBase | IVocabIdentifier | IVocabProperty | IVocabQuantity)[];
}

/**
 * Base type for any controlled vocabulary
 */
export type IVocabBase = {
  name: string;
  description;
};

// type copy from WebSDK, may require changes. Double check the API.
export interface IVocabIdentifier extends IVocabBase {
  names: string[];
  value_type: 'string' | 'integer' | 'number' | 'list[number]';
  value_length: number;
}

// type copy from WebSDK, may require changes. Double check the API.
export interface IVocabQuantity extends IVocabIdentifier {
  range: [number, number];
  si_unit: string;
  prefer_unit: string;
}

// type copy from WebSDK, may require changes. Double check the API.
export interface IVocabProperty extends IVocabQuantity {
  methods: string;
}

export declare type IControlledVocabulary = {
  algorithm_key: any[];
  algorithm_type: any[];
  building_block: any[];
  citation_type: IVocabBase[];
  computation_type: IVocabBase[];
  computational_forcefield_key: IVocabBase[];
  computational_process_property_key: IVocabProperty[];
  computational_process_type: IVocabBase[];
  condition_key: IVocabQuantity[];
  data_license: any[];
  data_type: IVocabBase[];
  equipment_key: IVocabBase[];
  file_type: IVocabBase[];
  ingredient_keyword: IVocabBase[];
  material_identifier_key: IVocabIdentifier[];
  material_keyword: IVocabBase[];
  material_property_key: IVocabProperty[];
  parameter_key: any[];
  process_keyword: IVocabBase[];
  process_property_key: IVocabProperty[];
  process_type: IVocabBase[];
  property_method: IVocabBase[];
  quantity_key: IVocabQuantity[];
  reference_type: any[];
  set_type: IVocabBase[];
  uncertainty_type: IVocabBase[];
};
