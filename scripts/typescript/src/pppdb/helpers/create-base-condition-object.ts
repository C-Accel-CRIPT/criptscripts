import { ICondition } from "@cript";

export enum ConditionType {
  value = "value",
  min = "min",
  max = "max",
  referenceVolume = "reference_volume",
}

export const createConditionObject = (condition: Partial<ICondition>) =>
  ({
    node: ["Condition"],
    key: condition.key || "temperature",
    type: condition.type || ConditionType.value,
    ...condition,
  } as ICondition);
