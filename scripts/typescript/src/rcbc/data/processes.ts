import { IIngredient, IMaterial, IProcess } from "@cript";
import * as materials from './materials'

/*
   Processes related to Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))
*/

export const etherification_methylhydroroquin: Partial<IProcess> = {
  name: "Etherification of methylhydroquinone dissolve, reflux at 80 °C  for 1h",
  node: ["Process"],
  ingredient: [
    {
      material: [materials.methylhydroquinone],
    },
    {
      material: [materials.koh],
    },
    {
      material: [materials.ethanol],
    },
  ] as IIngredient[],
};

export const reflux_overnight: Partial<IProcess> = {
  name: "Reflux at 80 °C overnight",
  node: ["Process"],
  prerequisite_process: [etherification_methylhydroroquin as IProcess],
  ingredient: [
    {
      material: [materials.ethylhexyl_bromide],
    },
  ] as IIngredient[],
};

export const poured_out_on_water: Partial<IProcess> = {
  name: "Poured out on water",
  node: ["Process"],
  prerequisite_process: [reflux_overnight as IProcess],
};

export const extracted_with_ether: Partial<IProcess> = {
  name: "extracted with ether",
  node: ["Process"],
  prerequisite_process: [poured_out_on_water as IProcess],
};

export const clean_chromatography: Partial<IProcess> = {
  name: "clean with column chromatography",
  node: ["Process"],
  product: [materials.ethylhexyloxy_toluene as IMaterial],
  prerequisite_process: [extracted_with_ether as IProcess],
};

/*
   Processes related to Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)
*/

export const mixing: Partial<IProcess> = {
  name: "mixing",
  node: ["Process"],
  //prerequisite_process: [poured_out_on_water as IProcess],
  ingredient: [
    {
      material: [materials.ethylhexyloxy_toluene],
    },
    {
      material: [materials.chlorophorm],
    },
    {
      material: [materials.dimethylformamide],
    },
  ] as IIngredient[],
};

export const react_below_40: Partial<IProcess> = {
  name: "react below 40 °C, stir for 1h at ambient temperature",
  node: ["Process"],
  prerequisite_process: [mixing as IProcess],
  ingredient: [
    {
      material: [materials.POCl3],
    },
  ] as IIngredient[],
};

export const refluxed_at_80: Partial<IProcess> = {
  name: "refluxed at 80 °C for 48 h",
  node: ["Process"],
  prerequisite_process: [react_below_40 as IProcess],
};

export const poured_out_on_ice: Partial<IProcess> = {
  name: "Poured out on ice",
  node: ["Process"],
  prerequisite_process: [refluxed_at_80 as IProcess],
  ingredient: [
    {
      material: [materials.water],
    },
  ] as IIngredient[],
};

export const extracted_into_dichloromethane: Partial<IProcess> = {
  name: "extracted into dichloromethane, and neutralized",
  node: ["Process"],
  prerequisite_process: [poured_out_on_ice as IProcess],
  ingredient: [
    {
      material: [materials.dichloromethane],
    },
  ] as IIngredient[],
};

export const purify_with_column_chromatography: Partial<IProcess> = {
  name: "purify with column chromatography",
  node: ["Process"],
  prerequisite_process: [extracted_into_dichloromethane as IProcess],
  product: [materials.diethylhexyloxy4methylbenzaldehyde as IMaterial],
};

/*
   Processes related to Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)
*/

export const reaction_at_60: Partial<IProcess> = {
  name: "Reaction at 60 °C under ~10 Torr vacuum for 2h",
  node: ["Process"],
  //prerequisite_process: [ as IProcess],
  ingredient: [
    {
      material: [materials.diethylhexyloxy4methylbenzaldehyde],
    },
    {
      material: [materials.aniline],
    },
  ] as IIngredient[],
  product: [materials.diethylhexyloxy4methylbenzaldehyde as IMaterial],
};

/*
  Processes related to Synthesis of poly(phenylene vinylene)
*/

export const heat_to_30: Partial<IProcess> = {
  name: "Heat to 30 °C, react for 30 min",
  node: ["Process"],
  ingredient: [{
    material: [materials.diethylhexyloxy4methylbenzylideneaniline]
  },{
    material: [materials.potassiumtertbutoxide]
  },{
    material: [materials.dimethylformamide]
  }] as IIngredient[],
};

export const acidified_water_and_stir: Partial<IProcess> = {
  name: "Acidified water and stir for 48h to hydrolyze the unreacted imines",
  node: ["Process"],
  ingredient: [{ material: [materials.water] }] as IIngredient[],
  prerequisite_process: [heat_to_30 as IProcess],
};

export const collect_neutralize_product: Partial<IProcess> = {
  name: "collect, neutralize product",
  node: ["Process"],
  prerequisite_process: [acidified_water_and_stir as IProcess],
};

export const fractionate_with_chroma: Partial<IProcess> = {
  name: "fractionate with a chromatography column",
  node: ["Process"],
  prerequisite_process: [collect_neutralize_product as IProcess],
  ingredient: [{
    material: [materials.methanol]
  }] as IIngredient[],
  product: [materials.PPV as IMaterial]
};

/*
   Processes related to Synthesis of PPVbPI-42
*/

export const anionic_polymerization_synth_42 = {
  name: "Anionic polymerization  PI-42",
  ingredient: [{
    material: [materials.isoprene]
  },{
    material: [materials.benzene]
  },{
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_42]
} as IProcess;

export const react_for_30mn_synth_42 = {
  name: "Polyisoprene (PI-42)",
  prerequisite_process: [anionic_polymerization_synth_42],
  ingredient: [{
    material: [materials.polyisoprene_42]
  },{
    material: [materials.PPV]
  }]
} as IProcess;

export const terminate_remaining_synth_42 = {
  name: "Terminate remaining PI with butanol 42",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_42],
  ingredient: [{
    material: [materials.butanol]
  }]
} as IProcess;

export const precipitate_with_methanol_synth_42 = {
  name: "Precipitate with methanol 42",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_42],
} as IProcess;

export const remove_homopolymer_with_synth_42 = {
  name: "Remove homopolymer with column chromatography 42",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_42],
  product: [materials.PPV_b_PI_42]
} as IProcess

/*
   Processes related to Synthesis of PPVbPI-59
*/

export const anionic_polymerization_synth_59 = {
  name: "Anionic polymerization  PI-59",
  ingredient: [{
    material: [materials.isoprene]
  },{
    material: [materials.benzene]
  },{
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_59]
} as IProcess;

export const react_for_30mn_synth_59 = {
  name: "Polyisoprene (PI-59)",
  prerequisite_process: [anionic_polymerization_synth_59],
  ingredient: [{
    material: [materials.polyisoprene_59]
  },{
    material: [materials.PPV]
  }]
} as IProcess;

export const terminate_remaining_synth_59 = {
  name: "Terminate remaining PI with butanol 59",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_59],
  ingredient: [{
    material: [materials.butanol]
  }]
} as IProcess;

export const precipitate_with_methanol_synth_59 = {
  name: "Precipitate with methanol 59",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_59],
} as IProcess;

export const remove_homopolymer_with_synth_59 = {
  name: "Remove homopolymer with column chromatography 59",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_59],
  product: [materials.PPV_b_PI_59]
} as IProcess

/*
   Processes related to Synthesis of PPVbPI-72
*/

export const anionic_polymerization_synth_72 = {
  name: "Anionic polymerization  PI-72",
  ingredient: [{
    material: [materials.isoprene]
  },{
    material: [materials.benzene]
  },{
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_72]
} as IProcess;

export const react_for_30mn_synth_72 = {
  name: "Polyisoprene (PI-72)",
  prerequisite_process: [anionic_polymerization_synth_72],
  ingredient: [{
    material: [materials.polyisoprene_72]
  },{
    material: [materials.PPV]
  }]
} as IProcess;

export const terminate_remaining_synth_72 = {
  name: "Terminate remaining PI with butanol 72",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_72],
  ingredient: [{
    material: [materials.butanol]
  }]
} as IProcess;

export const precipitate_with_methanol_synth_72 = {
  name: "Precipitate with methanol 72",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_72],
} as IProcess;

export const remove_homopolymer_with_synth_72 = {
  name: "Remove homopolymer with column chromatography 72",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_72],
  product: [materials.PPV_b_PI_72]
} as IProcess

/*
   Processes related to Synthesis of PPVbPI-89
*/

export const anionic_polymerization_synth_89 = {
  name: "Anionic polymerization  PI-89",
  ingredient: [{
    material: [materials.isoprene]
  },{
    material: [materials.benzene]
  },{
    material: [materials.sec_butyllithium_in_cyclohexane]
  }],
  product: [materials.polyisoprene_89]
} as IProcess;

export const react_for_30mn_synth_89 = {
  name: "Polyisoprene (PI-89)",
  prerequisite_process: [anionic_polymerization_synth_89],
  ingredient: [{
    material: [materials.polyisoprene_89]
  },{
    material: [materials.PPV]
  }]
} as IProcess;

export const terminate_remaining_synth_89 = {
  name: "Terminate remaining PI with butanol 89",
  node: ['Process'],
  prerequisite_process: [react_for_30mn_synth_89],
  ingredient: [{
    material: [materials.butanol]
  }]
} as IProcess;

export const precipitate_with_methanol_synth_89 = {
  name: "Precipitate with methanol 89",
  node: ['Process'],
  prerequisite_process: [terminate_remaining_synth_89],
} as IProcess;

export const remove_homopolymer_with_synth_89 = {
  name: "Remove homopolymer with column chromatography 89",
  node: ['Process'],
  prerequisite_process: [precipitate_with_methanol_synth_89],
  product: [materials.PPV_b_PI_89]
} as IProcess


/*
   Processes related to Phase Behavior Study
*/

// TODO
