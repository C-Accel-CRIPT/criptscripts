export interface IReference {
  readonly node: ['Reference'];
  created_at: string;
  doi: string;
  uid: string;
  uuid: string;
  updated_at: string;
  title: string;
  year: string;
  journal: string;
  publisher: string;
  volume: string;
  issue: string;
  issn: string;
  arxiv_id: string;
  pmid: string;
  website: string;
  author?: string[];
  pages?: string[];
}
