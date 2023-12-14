import { EdgeUUID, ICollection, IMaterial } from "./index";
import { EdgeUID } from "./Edges";

export interface IInventory {
  name: string;
  notes?: string;
  material_count?: number;
  material?: (IMaterial|EdgeUID|EdgeUUID)[];
  public?: boolean;
  uid?: string;
  uuid?: string;
  collection?: ICollection[];
  readonly node: ['Inventory'];
}
