/**
 * Type matching with src/data/sheets/chi.xlsx.
 */
export type Chi = {
    /** This field does not exist in the xslx, but we use it to know the source row index*/
    row: number;

     // ordered like the columns in the xslx

    /** Column A, @see https://www.doi.org/ */
    doi: string;
    /** Column B, Compound 1's name (ex: "poly(lactic acid)") */
    compound1: string;
    /** Column C, Compound 1's type */
    type1: CompoundType;
    /** Column D, (ex: 'PLA', 'PMA', 'PMA', 'H2O', 'PT', 'P3MT', 'P3BT', 'P3HT', etc.) */
    ac1: string;
    /** Column E */
    composition1: number;
    /** Column F, Compound 2 name (ex: "poly(6-methyl-ε-caprolactone)" ) */
    compound2: string;
    /** Column G, Compound 2's type */
    type2: CompoundType;
    /** Column H,
     * (ex: 'PLA', 'PMA', 'PMA', 'H2O', 'PT', 'P3MT', 'P3BT', 'P3HT', etc.)
     */
    ac2: string;
    /** Column I */
    composition2: number;
    /** Column J */
    molmass1?: number;
    /** Column K  */
    molmass2?: number;
    /** Column L */
    molmassunit?: string;
    /** Column M */
    type: `Type ${1|2|3|4|5}`;
    /**
     * Column N,
     * This method value does not correspond to CRIPT's data model method.
     * It needs to be converted using a mapping defined in methods.xslx.
     * (example: ""Small-angle X-ray scattering of triblock copolymer")
     */
    method: string;
    /** Column O */
    temperature: number;
    /** Column P */
    tempmax: number;
    /** Column Q */
    tempunit: string;
    /** Column R */
    abstract: number;
    /** Column S */
    text: number;
    /** Column T, integer */
    figurenumber: number;
    /** Column U, integer */
    tablenumber: number;
    /** Column V, integer */
    eqnumber: number;
    /** Column W, floating-point */
    chinumber: number;
    /** Column X */
    chimax: number;
    /** Column Y */
    chierror: number;
    /** Column Z*/
    chia: number;
    /** Column AA */
    chiaerror: number;
    /** Column AB */
    chib: number;
    /** Column AC */
    chiberror: number;    
    /** Column AF */
    indirect: number;
    /** Column AH.
     * Can contain a DOI, ISBN, and other types or references */
    reference: string;
    /** Column AI */
    notes: string;
    /** Column AJ, unique identifier */
    id: number;
    /** Column AK */
    refvolume: number;
    /** Column AL */
    refvolumeunit: string;
}

export type CompoundType = 'polymer' | 'solvent' | 'other';