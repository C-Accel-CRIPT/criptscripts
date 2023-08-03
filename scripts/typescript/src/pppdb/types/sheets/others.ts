/**
 * type matching with others.xlsx columns
 */
export type Other = {
    // Column not present in the file, we use it to store the index from the xlsx file
    _row_index: number;
    
    /** Column A */
    compound1: string;
    /** Column B */
    type1: string;
    /** Column C */
    ac1: string;
    /** Column D */
    'InChI Key': string;
    /** Column E */
    'PubChem CID': string;
    /** Column F */
    CAS: string;
    /** Column G */
    SMILES: string;
    /** Column H */
    InChI: string
    /** Column I */
    'Chem Formula': string;
};