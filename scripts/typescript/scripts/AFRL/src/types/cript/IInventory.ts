import { ICollection, IMaterial } from './index';

export interface IInventory {
  name: string;
  notes?: string;
  material_count?: number;
  material?: IMaterial[];
  public?: boolean;
  uid?: string;
  uuid?: string;
  collection?: ICollection[];
  readonly node: ['Inventory'];
}
