import { IIngredient, IMaterial, IProcess } from "../afrl/types/cript";
import { ethanol, ethylhexyl_bromide, ethylhexyloxy_toluene, koh, methylhydroquinone } from "./materials";

/*
   Processes related to Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))
*/

export const etherification_methylhydroroquin: Partial<IProcess> = {
    name: "Etherification of methylhydroquinone dissolve, reflux at 80 °C  for 1h",
    node: ['Process'],
    ingredient: [{
        material: [methylhydroquinone]
    }, {
        material: [koh]
    },{
        material: [ethanol]
    }] as IIngredient[]
}

export const reflux_overnight: Partial<IProcess> = {
    name: "Reflux at 80 °C overnight",
    node: ['Process'],
    prerequisite_process: [etherification_methylhydroroquin as IProcess],
    ingredient: [{
        material: [ethylhexyl_bromide]
    }] as IIngredient[]
}

export const poured_out_on_water: Partial<IProcess> = {
    name: "Poured out on water",
    node: ['Process'],
    prerequisite_process: [reflux_overnight as IProcess],
}

export const extracted_with_ether: Partial<IProcess> = {
    name: "extracted with ether",
    node: ['Process'],
    prerequisite_process: [poured_out_on_water as IProcess],
}

export const clean_chromatography: Partial<IProcess> = {
    name: "clean with column chromatography",
    node: ['Process'],
    product: [ethylhexyloxy_toluene as IMaterial],
    prerequisite_process: [extracted_with_ether as IProcess],
}

/*
   Processes related to Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)
*/

export const mixing: Partial<IProcess> = {
    name: "mixing",
    node: ['Process'],
    //prerequisite_process: [poured_out_on_water as IProcess],
}

export const react_below_40: Partial<IProcess> = {
    name: "react below 40 °C, stir for 1h at ambient temperature",
    node: ['Process'],
    prerequisite_process: [mixing as IProcess],
}

export const refluxed_at_80: Partial<IProcess> = {
    name: "refluxed at 80 °C for 48 h",
    node: ['Process'],
    prerequisite_process: [react_below_40 as IProcess],
}

export const poured_out_on_ice: Partial<IProcess> = {
    name: "Poured out on ice",
    node: ['Process'],
    prerequisite_process: [refluxed_at_80 as IProcess],
}

export const extracted_into_dichloromethane: Partial<IProcess> = {
    name: "extracted into dichloromethane, and neutralized",
    node: ['Process'],
    prerequisite_process: [poured_out_on_ice as IProcess],
}

export const purify_with_column_chromatography: Partial<IProcess> = {
    name: "purify with column chromatography",
    node: ['Process'],
    prerequisite_process: [extracted_into_dichloromethane as IProcess],
}

/*
   Processes related to Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)
*/

// TODO

/*
   Processes related to Synthesis of PPVbPI-42 / 59 / 72 and 89
*/

// TODO

/*
   Processes related to Phase Behavior Study
*/

// TODO
