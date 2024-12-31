import { Chi } from "pppdb/types";

// TOFIX: make explicit 1 or 2 HERE!!!!!
export const createCombinedStructure = (chi_row: Chi, type: 1 | 2): string => {
  const smiles = chi_row.BigSMILEScombined;
  return type === 1
    ? smiles.replaceAll(":2", "")
    : type === 2
    ? smiles.replaceAll(":1", "").replaceAll(":2", ":1")
    : smiles;
};
