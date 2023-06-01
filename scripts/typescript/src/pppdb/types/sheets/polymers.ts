/**
 * type matching with src/data/sheets/polymers.xlsx columns
 */
export type Polymer = {
    // This column does not exist in the xslx file, we need it for debugging purpose.
    row: number;

    // ordered like the columns in the xslx

    'Name (old)': string;
    type: string;
    'abbreviation (old)': string;
    'Name (new)': string;
    'Abbreviation (new)': string;
    InChI: string;
    'InChI Key': string;
    Thesaurus: string;
    'Thesaurus (abbreviation)': string;
    'Notes for Roselyne': string;
    'Notes for reviewers': string;
}