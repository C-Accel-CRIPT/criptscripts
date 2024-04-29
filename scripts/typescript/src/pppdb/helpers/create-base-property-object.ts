import { IProperty } from "@cript";

export enum PropertyType {
  concVolFraction = "conc_vol_fraction",
  value = "value",
  min = "min",
  max = "max",
}

export const createPropertyObject = (property: Partial<IProperty>) =>
  ({
    node: ["Property"],
    key: property.key || "interaction_param",
    type: property.type || "value",
    unit: property.unit || null,
    ...property,
  } as IProperty);
