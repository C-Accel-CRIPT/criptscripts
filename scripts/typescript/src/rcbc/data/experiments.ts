import { IData, IExperiment, IProcess } from "@cript";
import * as datasets from "./datasets";
import * as processes from "./processes";

export const synth_mol1: Partial<IExperiment> = {
  name: "Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))",
  node: ["Experiment"],
  data: [datasets.nmr_diether as IData],
  process: [
    processes.etherification_methylhydroroquin,
    processes.reflux_overnight,
    processes.poured_out_on_water,
    processes.extracted_with_ether,
    processes.clean_chromatography,
  ] as IProcess[],
};

export const synth_mol2: Partial<IExperiment> = {
  name: "Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)",
  node: ["Experiment"],
  data: [datasets.nmr_aldehyde as IData],
  process: [
    processes.mixing,
    processes.react_below_40,
    processes.refluxed_at_80,
    processes.poured_out_on_ice,
    processes.clean_chromatography,
    processes.extracted_into_dichloromethane,
    processes.purify_with_column_chromatography,
  ] as IProcess[],
};

export const synth_mol3: Partial<IExperiment> = {
  name: "Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)",
  node: ["Experiment"],
  data: [datasets.nmr_imine as IData],
  process: [processes.reaction_at_60] as IProcess[],
};

export const synth_polyphenylenevinylene: Partial<IExperiment> = {
  name: "Synthesis of poly(phenylene vinylene)",
  node: ["Experiment"],
  data: [
    datasets.gpc_ppv,
    datasets.density_column_ppv,
    datasets.dsc_ppv,
    datasets.nmr_ppv,
    datasets.pom_ppv,
  ] as IData[],
  process: [
    processes.heat_to_30,
    processes.acidified_water_and_stir,
    processes.collect_neutralize_product,
    processes.fractionate_with_chroma,
  ] as IProcess[]
};

export const synth_42: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-42",
  node: ["Experiment"],
};

export const synth_59: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-59",
  node: ["Experiment"],
};

export const synth_72: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-72",
  node: ["Experiment"],
};

export const synth_89: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-89",
  node: ["Experiment"],
};

export const phase_behavior: Partial<IExperiment> = {
  name: "Phase Behavior Study",
  node: ["Experiment"],
};
