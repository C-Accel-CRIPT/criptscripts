import { ICollection } from "@cript";
import { default_notes } from "./shared";
import * as experiments from "./experiments";

export const collection: ICollection = {
  name: "Olsen et al. PPV-b-PI",
  notes: default_notes,
  inventory: [],
  experiment: [...Object.values(experiments)],
  node: ['Collection']
};
