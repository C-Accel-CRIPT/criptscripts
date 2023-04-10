import { IData, IMaterial, IProperty } from "../afrl/types/cript";
import { nmr_diether, nmr_aldehyde } from "./datasets";
import { default_notes } from "./shared";

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
      notes: default_notes,
      data: [nmr_diether as IData],
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

export const diethylhexyloxy4methylbenzaldehyde: Partial<IMaterial> = {
  name: "2,5-Di(2′-ethylhexyloxy)-4-methylbenzaldehyde",
  node: ["Material"],
  property: [
    {
      node: ["Property"],
      model_version: "1.0.0",
      key: "nmr",
      type: "",
      value: "",
      notes: "NMR aldehyde",
      data: [nmr_aldehyde as IData],
    } as IProperty,
  ],
};

/** All materials */
export const materials: Partial<IMaterial>[] = [
  methylhydroquinone,
  koh,
  ethanol,
  ethylhexyl_bromide,
  diethyl_ether,
  ethylhexyloxy_toluene,
];
