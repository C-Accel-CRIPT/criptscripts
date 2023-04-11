import { IProcess } from "../../types/cript";
import * as materials from './materials'

/*
   Processes related to Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))
*/
export const etherification_methylhydroroquin: IProcess = {
  name: "Etherification of methylhydroquinone dissolve, reflux at 80 °C  for 1h",
  node: ["Process"],
  ingredient: [
    {
      node: ["Ingredient"],
      material: [materials.methylhydroquinone],
    },
    {
      node: ["Ingredient"],
      material: [materials.koh],
    },
    {
      node: ["Ingredient"],
      material: [materials.ethanol],
    },
  ],
};

export const reflux_overnight: IProcess = {
  name: "Reflux at 80 °C overnight",
  node: ["Process"],
  prerequisite_process: [etherification_methylhydroroquin],
  ingredient: [
    {
      node: ["Ingredient"],
      material: [materials.ethylhexyl_bromide],
    },
  ],
};

export const poured_out_on_water: IProcess = {
  name: "Poured out on water",
  node: ["Process"],
  prerequisite_process: [reflux_overnight],
};

export const extracted_with_ether: IProcess = {
  name: "extracted with ether",
  node: ["Process"],
  prerequisite_process: [poured_out_on_water],
};

export const clean_chromatography: IProcess = {
  name: "clean with column chromatography",
  node: ["Process"],
  product: [materials.ethylhexyloxy_toluene],
  prerequisite_process: [extracted_with_ether],
};

/*
   Processes related to Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)
*/

export const mixing: IProcess = {
  name: "mixing",
  node: ["Process"],
  //prerequisite_process: [poured_out_on_water],
  ingredient: [
    {
      node: ["Ingredient"],
      material: [materials.ethylhexyloxy_toluene],
    },
    {
      node: ["Ingredient"],
      material: [materials.chlorophorm],
    },
    {
      node: ["Ingredient"],
      material: [materials.dimethylformamide],
    },
  ],
};

export const react_below_40: IProcess = {
  name: "react below 40 °C, stir for 1h at ambient temperature",
  node: ["Process"],
  prerequisite_process: [mixing],
  ingredient: [
    {
      node: ["Ingredient"],
      material: [materials.POCl3],
    },
  ],
};

export const refluxed_at_80: IProcess = {
  name: "refluxed at 80 °C for 48 h",
  node: ["Process"],
  prerequisite_process: [react_below_40],
};

export const poured_out_on_ice: IProcess = {
  name: "Poured out on ice",
  node: ["Process"],
  prerequisite_process: [refluxed_at_80],
  ingredient: [
    {
      node: ["Ingredient"],
      material: [materials.water],
    },
  ],
};

export const extracted_into_dichloromethane: IProcess = {
  name: "extracted into dichloromethane, and neutralized",
  node: ["Process"],
  prerequisite_process: [poured_out_on_ice],
  ingredient: [
    {
      node: ["Ingredient"],
      material: [materials.dichloromethane],
    },
  ],
};

export const purify_with_column_chromatography: IProcess = {
  name: "purify with column chromatography",
  node: ["Process"],
  prerequisite_process: [extracted_into_dichloromethane],
  product: [materials.diethylhexyloxy4methylbenzaldehyde],
};

/*
   Processes related to Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)
*/

export const reaction_at_60: IProcess = {
  name: "Reaction at 60 °C under ~10 Torr vacuum for 2h",
  node: ["Process"],
  //prerequisite_process: [],
  ingredient: [
    {
      node: ["Ingredient"],
      material: [materials.diethylhexyloxy4methylbenzaldehyde],
    },
    {
      node: ["Ingredient"],
      material: [materials.aniline],
    },
  ],
  product: [materials.diethylhexyloxy4methylbenzaldehyde],
};

/*
  Processes related to Synthesis of poly(phenylene vinylene)
*/

export const heat_to_30: IProcess = {
  name: "Heat to 30 °C, react for 30 min",
  node: ["Process"],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.diethylhexyloxy4methylbenzylideneaniline]
  },{
    node: ["Ingredient"],
    material: [materials.potassiumtertbutoxide]
  },{
    node: ["Ingredient"],
    material: [materials.dimethylformamide]
  }],
};

export const acidified_water_and_stir: IProcess = {
  name: "Acidified water and stir for 48h to hydrolyze the unreacted imines",
  node: ["Process"],
  ingredient: [{ node: ["Ingredient"], material: [materials.water] }],
  prerequisite_process: [heat_to_30],
};

export const collect_neutralize_product: IProcess = {
  name: "collect, neutralize product",
  node: ["Process"],
  prerequisite_process: [acidified_water_and_stir],
};

export const fractionate_with_chroma: IProcess = {
  name: "fractionate with a chromatography column",
  node: ["Process"],
  prerequisite_process: [collect_neutralize_product],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.methanol]
  }],
  product: [materials.PPV]
};

/*
   Processes related to Synthesis of PPVbPI-42
*/

export const anionic_polymerization_synth_42: IProcess = {
  name: "Anionic polymerization  PI-42",
  node: ['Process'],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.isoprene]
  },{
    node: ["Ingredient"],
    material: [materials.benzene]
  },{
    node: ["Ingredient"],
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_42]
};

export const react_for_30mn_synth_42: IProcess = {
  name: "Polyisoprene (PI-42)",
  node: ['Process'],
  prerequisite_process: [anionic_polymerization_synth_42],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.polyisoprene_42]
  },{
    node: ["Ingredient"],
    material: [materials.PPV]
  }]
};

export const terminate_remaining_synth_42: IProcess = {
  name: "Terminate remaining PI with butanol 42",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_42],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.butanol]
  }]
};

export const precipitate_with_methanol_synth_42: IProcess = {
  name: "Precipitate with methanol 42",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_42],
};

export const remove_homopolymer_with_synth_42: IProcess = {
  name: "Remove homopolymer with column chromatography 42",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_42],
  product: [materials.PPV_b_PI_42]
}

/*
   Processes related to Synthesis of PPVbPI-59
*/

export const anionic_polymerization_synth_59: IProcess = {
  name: "Anionic polymerization  PI-59",
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.isoprene]
  }, {
    node: ["Ingredient"],
    material: [materials.benzene]
  }, {
    node: ["Ingredient"],
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_59],
  node: ['Process']
};

export const react_for_30mn_synth_59: IProcess = {
  name: "Polyisoprene (PI-59)",
  prerequisite_process: [anionic_polymerization_synth_59],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.polyisoprene_59]
  }, {
    node: ["Ingredient"],
    material: [materials.PPV]
  }],
  node: ['Process']
};

export const terminate_remaining_synth_59: IProcess = {
  name: "Terminate remaining PI with butanol 59",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_59],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.butanol]
  }]
};

export const precipitate_with_methanol_synth_59: IProcess = {
  name: "Precipitate with methanol 59",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_59],
};

export const remove_homopolymer_with_synth_59: IProcess = {
  name: "Remove homopolymer with column chromatography 59",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_59],
  product: [materials.PPV_b_PI_59]
}

/*
   Processes related to Synthesis of PPVbPI-72
*/

export const anionic_polymerization_synth_72: IProcess = {
  name: "Anionic polymerization  PI-72",
  node:['Process'],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.isoprene]
  },{
    node: ["Ingredient"],
    material: [materials.benzene]
  },{
    node: ["Ingredient"],
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_72]
};

export const react_for_30mn_synth_72: IProcess = {
  node: ['Process'],
  name: "Polyisoprene (PI-72)",
  prerequisite_process: [anionic_polymerization_synth_72],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.polyisoprene_72]
  },{
    node: ["Ingredient"],
    material: [materials.PPV]
  }]
};

export const terminate_remaining_synth_72: IProcess = {
  name: "Terminate remaining PI with butanol 72",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_72],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.butanol]
  }]
};

export const precipitate_with_methanol_synth_72: IProcess = {
  name: "Precipitate with methanol 72",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_72],
};

export const remove_homopolymer_with_synth_72: IProcess = {
  name: "Remove homopolymer with column chromatography 72",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_72],
  product: [materials.PPV_b_PI_72]
}

/*
   Processes related to Synthesis of PPVbPI-89
*/

export const anionic_polymerization_synth_89: IProcess = {
  name: "Anionic polymerization  PI-89",
  node: ["Process"],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.isoprene]
  },{
    node: ["Ingredient"],
    material: [materials.benzene]
  },{
    node: ["Ingredient"],
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_89]
};

export const react_for_30mn_synth_89: IProcess = {
  name: "Polyisoprene (PI-89)",
  node: ["Process"],
  prerequisite_process: [anionic_polymerization_synth_89],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.polyisoprene_89]
  },{
    node: ["Ingredient"],
    material: [materials.PPV]
  }]
};

export const terminate_remaining_synth_89: IProcess = {
  name: "Terminate remaining PI with butanol 89",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_89],
  ingredient: [{
    node: ["Ingredient"],
    material: [materials.butanol]
  }]
};

export const precipitate_with_methanol_synth_89: IProcess = {
  name: "Precipitate with methanol 89",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_89],
};

export const remove_homopolymer_with_synth_89: IProcess = {
  name: "Remove homopolymer with column chromatography 89",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_89],
  product: [materials.PPV_b_PI_89]
}


/*
   Processes related to Phase Behavior Study
*/

// TODO
