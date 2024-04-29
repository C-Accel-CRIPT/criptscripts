import { ICitation, ICondition } from "@cript";
import { Chi } from "pppdb/types";

export const getSharedPropertyParams = (
  chi_row: Chi,
  method: string | undefined,
  shared_citation: ICitation[] | undefined
) => ({
  notes: `Method: ${chi_row.method}; Notes: ${chi_row.notes ?? "none"}`,
  method: method,
  condition: [] as ICondition[],
  citation: shared_citation,
});
