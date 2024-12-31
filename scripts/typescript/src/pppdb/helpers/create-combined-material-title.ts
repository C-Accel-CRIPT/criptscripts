import { Chi } from "pppdb/types";

export const createCombinedMaterialTitle = (chi_row: Chi) => {
  return chi_row.mixture
    ? `PPPDB_${chi_row.id}_${chi_row.compound1}_${chi_row.compound2}`
    : `PPPDB_${chi_row.id}_${chi_row.compoundcombined}`;
};
