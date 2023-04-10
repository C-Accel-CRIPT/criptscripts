import { IData, IMaterial, IProperty } from "../afrl/types/cript";
import { nmr_diether } from "./datasets";
import { default_notes } from "./shared";

export const methylhydroquinone: Partial<IMaterial> = {
    name: 'methylhydroquinone',
    node: ['Material']
}

export const koh: Partial<IMaterial> = {
    name: 'KOH',
    node: ['Material']
} 

export const ethanol: Partial<IMaterial> = {
    name: 'ethanol',
    node: ['Material']
} 

export const ethylhexyl_bromide: Partial<IMaterial> = {
    name: 'ethylhexyl bromide',
    node: ['Material']
}

export const diethyl_ether: Partial<IMaterial> = {
    name: 'diethyl ether',
    node: ['Material']
} 

export const ethylhexyloxy_toluene: Partial<IMaterial> = {
    name: '2,5-Di(2′-ethylhexyloxy)toluene',
    node: ['Material'],
    property: [{
        node: ['Property'],
        model_version: "1.0.0",
        key: "nmr",
        type: "",
        value: "",
        notes: default_notes,
        data: [nmr_diether as IData],
    } as IProperty]
}

export const materials: Partial<IMaterial>[] = [
    methylhydroquinone,
    koh,
    ethanol,
    ethylhexyl_bromide,
    diethyl_ether,
    ethylhexyloxy_toluene,
]