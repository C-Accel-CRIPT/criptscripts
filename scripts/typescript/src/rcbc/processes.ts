import { IIngredient, IMaterial, IProcess } from "../afrl/types/cript";
import { ethanol, ethylhexyl_bromide, ethylhexyloxy_toluene, koh, methylhydroquinone } from "./materials";

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