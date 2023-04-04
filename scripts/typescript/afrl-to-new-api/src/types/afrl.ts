export type AFRLData = {
  cloud_point_temp: number; 
  mixture_id: number;
  one_phase_direction: string;
  polymer_CAS: string;
  polymer_id: number;
  polymer_Mw?: number;
  polymer_PDI: number;
  polymer_SMILES: string;
  polymer_vol_frac: number;
  polymer_wt_frac: number | "";
  polymer: string;
  pressure_MPa: number;
  reference: string;
  solvent_CAS: string;
  solvent_id?: string;
  solvent_Mw: number;
  solvent_SMILES: string;
  solvent: string;
};

export type AFRLHeaders = {
    [key in keyof AFRLData]: string;
};
