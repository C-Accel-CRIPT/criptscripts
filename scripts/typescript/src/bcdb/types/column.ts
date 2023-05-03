/**
 * Enum to get a column name easily.
 * Colums correspond to the 'diblock' sheet of data/BCPs.xlsx
 * 
 * For more information about columns meaning @see https://docs.google.com/spreadsheets/d/1ZBav2SbVy5tdkgtj3bUOlHDbBuuDMRFD for more information
 */
export enum Column {

    index = "A",
    ORCID = "B",
    DOI = "C",
    PHASE1 = "D",
    PHASE2 = "E",
    phase_method = "F",
    T = "G",
    meas = "H",
    anneal = "I",
    Talt = "J",
    Tdescribe = "K",
    T_infer = "L",
    notes = "M",
    BigSMILES = "N",
    Mn = "O",
    Mn_method = "P",
    Mw = "Q",
    Mw_method = "R",
    D = "S",
    D_method = "T",
    N = "U",
    N_method = "V",
    name1 = "W",
    Mn1 = "X",
    Mn1_method = "Y",
    Mw1 = "Z",
    Mw1_method = "AA",
    D1 = "AB",
    D1_method = "AC",
    N1 = "AD",
    N1_method = "AE",
    f1 = "AF",
    f1_method = "AG",
    ftot1 = "AH",
    ftot1_method = "AI",
    w1 = "AJ",
    w1_method = "AK",
    rho1 = "AL",
    rho1_method = "AM",
    name2 = "AN",
    Mn2 = "AO",
    Mn2_method = "AP",
    Mw2 = "AQ",
    Mw2_method = "AR",
    D2 = "AS",
    D2_method = "AT",
    N2 = "AU",
    N2_method = "AV",
    f2 = "AW",
    f2_method = "AX",
    ftot2 = "AY",
    ftot2_method = "AZ",
    w2 = "BA",
    w2_method = "BB",
    rho2 = "BC",
    rho2_method = "BD",
    Tstd = "BE",
    measstd = "BF",
    annealstd = "BG",
    Taltstd = "BH",
    Mnstd = "BI",
    Mwstd = "BJ",
    Dstd = "BK",
    Nstd = "BL",
    Mn1std = "BM",
    Mw1std = "BN",
    D1std = "BO",
    N1std = "BP",
    f1std = "BQ",
    ftot1std = "BR",
    w1std = "BS",
    rho1std = "BT",
    Mn2std = "BU",
    Mw2std = "BV",
    D2std = "BW",
    N2std = "BX",
    f2std = "BY",
    ftot2std = "BZ",
    w2std = "CA",
    rho2std = "CB",
    Tse = "CC",
    measse = "CD",
    annealse = "CE",
    Taltse = "CF",
    Mnse = "CG",
    Mwse = "CH",
    Dse = "CI",
    Nse = "CJ",
    Mn1se = "CK",
    Mw1se = "CL",
    D1se = "CM",
    N1se = "CN",
    f1se = "CO",
    ftot1se = "CP",
    w1se = "CQ",
    rho1se = "CR",
    Mn2se = "CS",
    Mw2se = "CT",
    D2se = "CU",
    N2se = "CV",
    f2se = "CW",
    ftot2se = "CX",
    w2se = "CY",
    rho2se = "CZ",
    Tunc = "DA",
    Tdesc = "DB",
    measunc = "DC",
    measdesc = "DD",
    annealunc = "DE",
    annealdesc = "DF",
    Taltunc = "DG",
    Taltdesc = "DH",
    Mnunc = "DI",
    Mndesc = "DJ",
    Mwunc = "DK",
    Mwdesc = "DL",
    Dunc = "DM",
    Ddesc = "DN",
    Nunc = "DO",
    Ndesc = "DP",
    Mn1unc = "DQ",
    Mn1desc = "DR",
    Mw1unc = "DS",
    Mw1desc = "DT",
    D1unc = "DU",
    D1desc = "DV",
    N1unc = "DW",
    N1desc = "DX",
    f1unc = "DY",
    f1desc = "DZ",
    ftot1unc = "EA",
    ftot1desc = "EB",
    w1unc = "EC",
    w1desc = "ED",
    rho1unc = "EE",
    rho1desc = "EF",
    Mn2unc = "EG",
    Mn2desc = "EH",
    Mw2unc = "EI",
    Mw2desc = "EJ",
    D2unc = "EK",
    D2desc = "EL",
    N2unc = "EM",
    N2desc = "EN",
    f2unc = "EO",
    f2desc = "EP",
    ftot2unc = "EQ",
    ftot2desc = "ER",
    w2unc = "ES",
    w2desc = "ET",
    rho2unc = "EU",
    rho2desc = "EV",
}