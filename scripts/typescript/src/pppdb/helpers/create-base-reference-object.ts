import { IReference } from "@cript";
import { CriptGraph } from "@utilities";

export type CreatedReference = Required<Pick<IReference, "uuid" | "node" | "title" | "type">> & Partial<IReference>;

export enum ReferenceType {
  journalArticle = "journal_article",
  book = "book",
  thesis = "thesis",
}

export const createReferenceObject = (reference: Partial<IReference>) =>
  ({
    uuid: CriptGraph.make_uuid(),
    node: ["Reference"],
    ...reference,
  } as CreatedReference);
