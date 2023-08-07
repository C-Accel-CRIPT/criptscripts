/**
 * type matching with solvents.xlsx
 */
export type Solvent = {
    // This column does not exist in the xslx file, we need it for debugging purpose.
    _row_index: number;

    // ordered like the columns in the xslx

    /** Column A, do not use this one to search from chi.xslx, use column C instead */
    'Name of solvent (old)': string;
    type: string;	
    abbreviation: string;
    /** Column C */
    'name of solvent (new)': string;
    'abbreviation (new)': string;
    'InChI Key': string;
    'PubChem CID': string;
    /** Optionally provided, use only if fetch from PubChem fails */
    SMILES?: string;
    /** Optionally provided, use only if fetch from PubChem fails */
    InChI?: string;
    /** Optionally provided, use only if fetch from PubChem fails */
    'Chem Formula'?: string;
    Notes: string;
}
