import { IReference } from "./IReference";
import { EdgeUUID } from "./Edges";

export type CitationType =
  'extracted_by_human' |
  'extracted_by_nlp' |
  'extracted_by_algorithm' |
  'derived_from' |
  'replicated' |
  'reference';

export interface ICitation {
  readonly node: ['Citation'];
  created_at?: string;
  updated_at?: string;
  model_version?: string;
  reference: IReference | EdgeUUID;
  uuid?: string;
  type: CitationType;
}
