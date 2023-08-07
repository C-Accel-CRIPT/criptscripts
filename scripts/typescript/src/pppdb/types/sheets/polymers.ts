/**
 * type matching with src/data/sheets/polymers.xlsx columns
 */
export type Polymer = {
    // This column does not exist in the xslx file, we need it for debugging purpose.
    _row_index: number;

    // ordered like the columns in the xslx

    /** Column A, do not use this one to search from chi.xslx use column D instead */
    'Name (old)': string;
    type: string;
    'abbreviation (old)': string;
    /** Column D */
    'Name (new)': string;
    'Abbreviation (new)': string;
    InChI: string;
    'InChI Key': string;
    /** User provided BigSMILES, fetch from PubChem and use this if it fails */
    BigSMILES?: string;
    Thesaurus: string;
    'Thesaurus (abbreviation)': string;
    'Notes for Roselyne': string;
    'Notes for reviewers': string;
}