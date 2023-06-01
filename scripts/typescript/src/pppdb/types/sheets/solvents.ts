/**
 * type matching with src/data/sheets/solvents.xlsx columns
 */
export type Solvent = {
    // This column does not exist in the xslx file, we need it for debugging purpose.
    row: number;

    // ordered like the columns in the xslx
    
    'Name of solvent (old)': string;
    type: string;	
    abbreviation: string;
    'name of solvent (new)': string;
    'abbreviation (new)': string;
    'InChI Key': string;
    'PubChem CID': string;
    Notes: string;
}