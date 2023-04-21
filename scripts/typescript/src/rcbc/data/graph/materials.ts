import { IMaterial } from "@cript";
import * as datasets from "./datasets";
import * as computations from './computations'

/*
  Materials shared 
 */
export const ethylhexyloxy_toluene: IMaterial = {
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
      data: [datasets.nmr_diether],
    },
  ],
};

export const diethylhexyloxy4methylbenzaldehyde: IMaterial = {
  name: "2,5-Di(2′-ethylhexyloxy)-4-methylbenzaldehyde",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      key: "nmr",
      notes: "NMR aldehyde",
      data: [datasets.nmr_aldehyde],
    },
    {
      node: ["Property"],
      key: "nmr",
      notes: "NMR imine",
      data: [datasets.nmr_imine],
    },
  ],
};

/*
   Materials related to Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))
*/

export const methylhydroquinone: IMaterial = {
  name: "methylhydroquinone",
  node: ["Material"],
};

export const koh: IMaterial = {
  name: "KOH",
  node: ["Material"],
};

export const ethanol: IMaterial = {
  name: "ethanol",
  node: ["Material"],
};

export const ethylhexyl_bromide: IMaterial = {
  name: "ethylhexyl bromide",
  node: ["Material"],
};

export const diethyl_ether: IMaterial = {
  name: "diethyl ether",
  node: ["Material"],
};

/*
   Materials related to Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)
*/

export const chlorophorm: IMaterial = {
  name: "chloroform",
  node: ["Material"],
};

export const dimethylformamide: IMaterial = {
  name: "dimethylformamide",
  node: ["Material"],
};

export const POCl3: IMaterial = {
  name: "POCl3",
  node: ["Material"],
};

export const water: IMaterial = {
  name: "water",
  node: ["Material"],
};

export const dichloromethane: IMaterial = {
  name: "dichloromethane",
  node: ["Material"],
};

/*
   Materials related to Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)
*/

export const aniline: IMaterial = {
  name: "aniline",
  node: ["Material"],
};

/*
  Materials related to Synthesis of poly(phenylene vinylene)
*/

export const diethylhexyloxy4methylbenzylideneaniline: IMaterial = {
  name: "2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline",
  node: ["Material"],
};

export const methanol: IMaterial = {
  name: "methanol",
  node: ["Material"],
};

export const PPV: IMaterial = {
  name: "PPV",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PPV",
      data: [datasets.gpc_ppv],
    },
    {
      node: ["Property"],
      notes: "Density Column PPV",
      data: [datasets.density_column_ppv],
    },
    {
      node: ["Property"],
      notes: "DSC PPV",
      data: [datasets.dsc_ppv],
    },
    {
      node: ["Property"],
      key: "nmr",
      notes: "NMR PPV",
      data: [datasets.nmr_ppv],
    },
    {
      node: ["Property"],
      notes: "POM PPV",
      data: [datasets.pom_ppv],
    },
  ],
};

export const potassiumtertbutoxide: IMaterial = {
  name: "potassium tert-butoxide",
  node: ["Material"],
};

/**
  Materials related to Synthesis of PPVbPI-xx
 */

export const sec_butyllithium_in_cyclohexane: IMaterial = {
  name: "sec-butyllithium in cyclohexane",
  notes: "this is one material that is a mix of two so must be represented as such in the data model",
  node: ["Material"],
};

export const isoprene: IMaterial = {
  name: "isoprene",
  node: ["Material"],
};

export const benzene: IMaterial = {
  name: "benzene",
  node: ["Material"],
};

export const polyisoprene_42: IMaterial = {
  name: "Polyisoprene (PI-42)",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PI-42",
      data: [
        {
          name: "GPC PI-42",
          node: ["Data"],
        },
      ],
    },
  ],
};

export const polyisoprene_59: IMaterial = {
  name: "Polyisoprene (PI-59)",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PI-59",
      data: [
        {
          name: "GPC PI-59",
          node: ["Data"],
        },
      ],
    },
  ],
};

export const polyisoprene_72: IMaterial = {
  name: "Polyisoprene (PI-72)",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PI-72",
      data: [
        {
          name: "GPC PI-72",
          node: ["Data"],
        },
      ],
    },
  ],
};

export const polyisoprene_89: IMaterial = {
  name: "Polyisoprene (PI-89)",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PI-89",
      data: [
        {
          name: "GPC PI-89",
          node: ["Data"],
        },
      ],
    },
  ],
};

export const butanol: IMaterial = {
  name: "butanol",
  node: ["Material"],
};

/**
  Materials related to "Synthesis of PPVbPI-xx" AND "Phase Behavior Study"
 */
export const PPV_b_PI_42: IMaterial = {
  name: "PPV-b-PI-42",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-42",
      data: [
        {
          name: "GPC PPV-b-PI-42",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "WAXS PPV-b-PI-42",
      data: [
        {
          name: "WAXS PPV-b-PI-42",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "TEM PPV-b-PI-42",
      data: [
        {
          name: "TEM PPV-b-PI-42",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "POM PPV-b-PI-42",
      data: [
        {
          name: "POM PPV-b-PI-42",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "DPLS PPV-b-PI-42",
      data: [
        {
          name: "DPLS PPV-b-PI-42",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-42",
      computation: [ computations.analysis_PPVbPI_42 ],
    },

    {
      node: ["Property"],
      notes: "Peak Phase ID PPV-b-PI-42",
      computation: [ computations.peak_phase_id_PPVbPI_42 ],
    },

  ],
};

export const PPV_b_PI_59: IMaterial = {
  name: "PPV-b-PI-59",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-59",
      data: [
        {
          name: "GPC PPV-b-PI-59",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "WAXS PPV-b-PI-59",
      data: [
        {
          name: "WAXS PPV-b-PI-59",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "TEM PPV-b-PI-59",
      data: [
        {
          name: "TEM PPV-b-PI-59",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "POM PPV-b-PI-59",
      data: [
        {
          name: "POM PPV-b-PI-59",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "DPLS PPV-b-PI-59",
      data: [
        {
          name: "DPLS PPV-b-PI-59",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-59",
      computation: [ computations.analysis_PPVbPI_59 ],
    },

    {
      node: ["Property"],
      notes: "Peak Phase ID PPV-b-PI-59",
      computation: [ computations.peak_phase_id_PPVbPI_59 ],
    },
  ],
};

export const PPV_b_PI_72: IMaterial = {
  name: "PPV-b-PI-72",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-72",
      data: [
        {
          name: "GPC PPV-b-PI-72",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "WAXS PPV-b-PI-72",
      data: [
        {
          name: "WAXS PPV-b-PI-72",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "TEM PPV-b-PI-72",
      data: [
        {
          name: "TEM PPV-b-PI-72",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "POM PPV-b-PI-72",
      data: [
        {
          name: "POM PPV-b-PI-72",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "DPLS PPV-b-PI-72",
      data: [
        {
          name: "DPLS PPV-b-PI-72",
          node: ["Data"],
        },
      ],
    },
    
    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-72",
      computation: [ computations.analysis_PPVbPI_72 ],
    },

    {
      node: ["Property"],
      notes: "Peak Phase ID PPV-b-PI-72",
      computation: [ computations.peak_phase_id_PPVbPI_72 ],
    },
  ],
};

export const PPV_b_PI_89: IMaterial = {
  name: "PPV-b-PI-89",
  node: ["Material"],
  property: [
    //----------------------- TODO: complete properties (key, type, value, unit...)
    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-89",
      data: [
        {
          name: "GPC PPV-b-PI-89",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "WAXS PPV-b-PI-89",
      data: [
        {
          name: "WAXS PPV-b-PI-89",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "TEM PPV-b-PI-89",
      data: [
        {
          name: "TEM PPV-b-PI-89",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "POM PPV-b-PI-89",
      data: [
        {
          name: "POM PPV-b-PI-89",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "DPLS PPV-b-PI-89",
      data: [
        {
          name: "DPLS PPV-b-PI-89",
          node: ["Data"],
        },
      ],
    },

    {
      node: ["Property"],
      notes: "GPC PPV-b-PI-89",
      computation: [ computations.analysis_PPVbPI_89 ],
    },

    {
      node: ["Property"],
      notes: "Peak Phase ID PPV-b-PI-89",
      computation: [ computations.peak_phase_id_PPVbPI_89 ],
    },

  ],
};
