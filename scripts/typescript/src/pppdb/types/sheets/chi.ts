/**
 * Type matching with src/data/sheets/chi.xlsx.
 */
export type Chi = {
    /** This field does not exist in the xslx, but we use it to know the source row index*/
    _row_index: number;

     // ordered like the columns in the xslx

    /** Column A, @see https://www.doi.org/ */
    doi: string;
    /** Column B, Compound 1's name (ex: "poly(lactic acid)") */
    compound1: string;
    /** Column C, Compound 1's type */
    type1: CompoundType;
    /** Column D, BigSMILES1 */
    BigSMILES1: string;
    /** Column E, (ex: 'PLA', 'PMA', 'PMA', 'H2O', 'PT', 'P3MT', 'P3BT', 'P3HT', etc.) */
    ac1: string;
    /** Column F */
    composition1: number;
    /** Column G, Compound 2 name (ex: "poly(6-methyl-ε-caprolactone)" ) */
    compound2: string;
    /** Column H, Compound 2's type */
    type2: CompoundType;
    /** Column I, BigSMILES2 */
    BigSMILES2: string;
    /** Column J,
     * (ex: 'PLA', 'PMA', 'PMA', 'H2O', 'PT', 'P3MT', 'P3BT', 'P3HT', etc.)
     */
    ac2: string;
    /** Column K */
    composition2: number;
    /** Column L */
    molmass1?: number;
    /** Column M  */
    molmass2?: number;
    /** Column N */
    molmassunit?: string;
    /** Column O */
    type: `Type ${1|2|3|4|5}`;
    /**
     * Column P,
     * This method value does not correspond to CRIPT's data model method.
     * It needs to be converted using a mapping defined in methods.xslx.
     * (example: ""Small-angle X-ray scattering of triblock copolymer")
     */
    method: string;
    /** Column Q */
    temperature: number;
    /** Column R */
    tempmax: number;
    /** Column S */
    tempunit: string;
    /** Column T */
    abstract: number;
    /** Column U */
    text: number;
    /** Column V, integer */
    figurenumber: number;
    /** Column W, integer */
    tablenumber: number;
    /** Column X, integer */
    eqnumber: number;
    /** Column Y, floating-point */
    chinumber: number;
    /** Column Z */
    chimax: number;
    /** Column AA */
    chierror: number;
    /** Column AB */
    chia: number;
    /** Column AC */
    chiaerror: number;
    /** Column AD */
    chib: number;
    /** Column AE */
    chiberror: number;    
    /** Column AF */
    chic: number;
    /** Column AG */
    chicerror: number;
    /** Column AH */
    indirect: number;
    /** Column AI.
     * Can contain a DOI, ISBN, and other types or references */
    reference: string;
    /** Column AJ */
    notes: string;
    /** Column AK, unique identifier */
    id: number;
    /** Column AL */
    refvolume: number;
    /** Column AM */
    refvolumeunit: string;
}

export type CompoundType = 'polymer' | 'solvent' | 'other';