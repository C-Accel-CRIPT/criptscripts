import { IData, IMaterial, IProperty } from "@cript";
import {
  nmr_diether,
  nmr_aldehyde,
  nmr_imine,
  gpc_ppv,
  density_column_ppv,
  dsc_ppv,
  nmr_ppv,
  pom_ppv,
} from "./datasets";

/*
  Materials shared 
 */
export const ethylhexyloxy_toluene: Partial<IMaterial> = {
  name: "2,5-Di(2′-ethylhexyloxy)toluene",
  node: ["Material"],
  property: [
    {
      node: ["Property"],
      model_version: "1.0.0",
      key: "nmr",
      type: "",
      value: "",
      notes: "NRM diether",
      data: [nmr_diether as IData],
    } as IProperty,
  ],
};

export const diethylhexyloxy4methylbenzaldehyde: Partial<IMaterial> = {
  name: "2,5-Di(2′-ethylhexyloxy)-4-methylbenzaldehyde",
  node: ["Material"],
  property: [ //----------------------- uncomplete, properties lack of key, type, value, unit...?
    {
      node: ["Property"],
      key: "nmr",
      notes: "NMR aldehyde",
      data: [nmr_aldehyde] as IData[],
    } as IProperty,
    {
      node: ["Property"],
      key: "nmr",
      notes: "NMR imine",
      data: [nmr_imine] as IData[],
    } as IProperty,
  ],
};

/*
   Materials related to Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))
*/

export const methylhydroquinone: Partial<IMaterial> = {
  name: "methylhydroquinone",
  node: ["Material"],
};

export const koh: Partial<IMaterial> = {
  name: "KOH",
  node: ["Material"],
};

export const ethanol: Partial<IMaterial> = {
  name: "ethanol",
  node: ["Material"],
};

export const ethylhexyl_bromide: Partial<IMaterial> = {
  name: "ethylhexyl bromide",
  node: ["Material"],
};

export const diethyl_ether: Partial<IMaterial> = {
  name: "diethyl ether",
  node: ["Material"],
};

/*
   Materials related to Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)
*/

export const chlorophorm: Partial<IMaterial> = {
  name: "chloroform",
  node: ["Material"],
};

export const dimethylformamide: Partial<IMaterial> = {
  name: "dimethylformamide",
  node: ["Material"],
};

export const POCl3: Partial<IMaterial> = {
  name: "POCl3",
  node: ["Material"],
};

export const water: Partial<IMaterial> = {
  name: "water",
  node: ["Material"],
};

export const dichloromethane: Partial<IMaterial> = {
  name: "dichloromethane",
  node: ["Material"],
};

/*
   Materials related to Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)
*/

export const aniline: Partial<IMaterial> = {
  name: "aniline",
  node: ["Material"],
};

/*
  Materials related to Synthesis of poly(phenylene vinylene)
*/

export const diethylhexyloxy4methylbenzylideneaniline: Partial<IMaterial> = {
  name: "2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline",
  node: ["Material"],
};

export const methanol: Partial<IMaterial> = {
  name: "methanol",
  node: ["Material"],
};

export const PPV: Partial<IMaterial> = {
  name: "PPV",
  node: ["Material"],
  property: [ //----------------------- uncomplete, properties lack of key, type, value, unit...?
    {
      node: ["Property"],
      notes: "GPC PPV",
      data: [gpc_ppv] as IData[],
    } as IProperty,
    {
      node: ["Property"],
      notes: "Density Column PPV",
      data: [density_column_ppv] as IData[],
    } as IProperty,
    {
      node: ["Property"],
      notes: "DSC PPV",
      data: [dsc_ppv] as IData[],
    } as IProperty,
    {
      node: ["Property"],
      key: "nmr",
      notes: "NMR PPV",
      data: [nmr_ppv] as IData[],
    } as IProperty,
    {
      node: ["Property"],
      notes: "POM PPV",
      data: [pom_ppv] as IData[],
    } as IProperty,
  ],
};

export const potassiumtertbutoxide: Partial<IMaterial> = {
  name: "potassium tert-butoxide",
  node: ["Material"],
};

/** All materials */
export const materials: Partial<IMaterial>[] = [
  ethylhexyloxy_toluene,
  diethylhexyloxy4methylbenzaldehyde,

  methylhydroquinone,
  koh,
  ethanol,
  ethylhexyl_bromide,
  diethyl_ether,

  chlorophorm,
  dimethylformamide,
  POCl3,
  water,
  dichloromethane,

  aniline,

  diethylhexyloxy4methylbenzylideneaniline,
  methanol,
  PPV,
  potassiumtertbutoxide,
];
