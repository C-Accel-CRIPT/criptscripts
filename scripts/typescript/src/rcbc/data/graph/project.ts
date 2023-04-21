import { IProject } from "@cript";
import { collection } from "./collection";
import * as materials from "./materials";
import { default_notes } from "./shared";

export const project = {
  name: "CRIPT End-to-End Test Papers",
  model_version: '1.0.0',
  notes: default_notes,
  material: [...Object.values(materials)],
  collection: [collection],
  node: ["Project"]
} satisfies IProject;
