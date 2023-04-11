import { ICollection, IMaterial, IProject } from "../../types/cript";
import { collection } from "./collection";
import * as materials from "./materials";
import { default_notes } from "./shared";

export const project: Partial<IProject> = {
  name: "CRIPT End-to-End Test Papers",
  notes: default_notes,
  material: [...Object.values(materials)] as IMaterial[],
  collection: [collection as ICollection],
  node: ["Project"],
};
