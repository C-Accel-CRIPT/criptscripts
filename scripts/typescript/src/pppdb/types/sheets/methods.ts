/**
 * type matching with src/data/sheets/methods.xlsx columns
 */
export type Method = {
    // This column does not exist in the xslx file, we need it for debugging purpose.
    _row_index: number;

    // ordered like the columns in the xslx
    
    /** Column A */
    Method: string;
    /** Column B */
    'Method with key': string; 
}