import { IReference } from "./IReference";

export type CitationType =
  'extracted_by_human' |
  'extracted_by_nlp' |
  'extracted_by_algorithm' |
  'derived_from' |
  'replicated' |
  'reference';

export interface ICitation {
  readonly node: 'Citation';
  name: string;
  created_at: string;
  updated_at: string;
  model_version: string;
  reference: IReference;
  uuid: string;
  // type: string;
  type: CitationType;
}
