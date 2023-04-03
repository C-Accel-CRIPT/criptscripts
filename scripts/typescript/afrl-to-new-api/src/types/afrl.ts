export type AFRLData = {

  // General questions:
  // - What are the units of all the fields?
  // - Which fields can be discarded?

  // 0 - process properties?
  //-=-=-=-=-=-=-=-=-=-=-=-=-

  // Do we need to keep track of this identifier?
  mixture_id: number;

  // process property (vocab key: "pressure, Absolute pressure") ?
  pressure_MPa: number;

  // process property (vocab key: "temperature, Temperature" ) ?
  cloud_point_temp: number; 

  // process property? It yes, it seams there is no key for it, do you have a suggestion?
  one_phase_direction: string;

  // This field store a doi as string.
  // We can store it within a Reference (has a doi) added to the citations of this Process.
  // Is it correct?
  reference: string;

  // 1 - polymer related
  //=-=-=-=-=-=-=-==-=-=

  // I assume "polymerxxxx" describe an "ingredient" Material (with the key "polymer")
  // Is there a way to know the quantity of the ingredient used? (Mass, Volume, or Mol)

  // material's name?
  polymer: string;

  // Do we need to keep track of this identifier?
  polymer_id: number;

  // material's identifier "cas".
  polymer_CAS: string;

  // material's identifier. Can we store it as a "bigsmiles" ?
  polymer_SMILES: string;

  // material's property "mw_xxx". There are a dozen of properties very similar.
  // Can we identify the correct key in the controlled vocabulary?
  polymer_Mw?: number;

  // material property? It yes, it seams there is no key for it, do you have a suggestion?
  polymer_PDI: number;

  // material's property. I identifier "conc_vol_fraction, volume of constituent divided by the volume of mixture", is it correct?
  polymer_vol_frac: number;

  // material's property?
  // This field is sometimes defined as an empty string, should we convert it to 0 or should we remove the property?
  polymer_wt_frac: number | "";

  // 2 - solvent related
  //-=-=-=-=-==--==-=-=-

  // I assume "solventxxx" decribes an "ingredient" Material (with the key "solvent")
  // Is there a way to know the quantity of the ingredient used? (Mass, Volume, or Mol)

  // material's name?
  solvent: string;

  // Do we need to keep track of this identifier? It is not always defined.
  solvent_id?: string;

  // material's identifier "cas".
  solvent_CAS: string;

  // DUPLICATE QUESTION: see question about polymer_Mw above
  solvent_Mw: number;

  // DUPLICATE QUESTION: see question about polymer_SMILES above
  solvent_SMILES: string;
};

export type AFRLHeaders = {
    [key in keyof AFRLData]: string;
};
