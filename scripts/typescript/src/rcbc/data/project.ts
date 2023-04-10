import { ICollection, IMaterial, IProject } from "@cript";
import { collection } from "./collection";
import { materials } from "./materials";
import { default_notes } from "./shared";

export const project: Partial<IProject> = {
  name: "CRIPT End-to-End Test Papers",
  notes: default_notes,
  material: materials as IMaterial[],
  collection: [collection as ICollection],
  node: ["Project"],
  model_version: "1.0.0",
};
