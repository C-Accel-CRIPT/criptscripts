import { IData, IExperiment, IProcess } from "../afrl/types/cript";
import { nmr_aldehyde, nmr_diether } from "./datasets";
import {
  clean_chromatography,
  etherification_methylhydroroquin,
  extracted_into_dichloromethane,
  extracted_with_ether,
  mixing,
  poured_out_on_ice,
  poured_out_on_water,
  purify_with_column_chromatography,
  react_below_40,
  reflux_overnight,
  refluxed_at_80,
} from "./processes";

export const exp_synth_mol1: Partial<IExperiment> = {
  name: "Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))",
  node: ["Experiment"],
  data: [nmr_diether as IData],
  process: [
    etherification_methylhydroroquin,
    reflux_overnight,
    poured_out_on_water,
    extracted_with_ether,
    clean_chromatography,
  ] as IProcess[],
};

export const exp_synth_mol2: Partial<IExperiment> = {
  name: "Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)",
  node: ["Experiment"],
  data: [nmr_aldehyde as IData],
  process: [
    mixing,
    react_below_40,
    refluxed_at_80,
    poured_out_on_ice,
    clean_chromatography,
    extracted_into_dichloromethane,
    purify_with_column_chromatography,
  ] as IProcess[],
};

export const exp_synth_mol3: Partial<IExperiment> = {
  name: "Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)",
  node: ["Experiment"],
};

export const exp_synth_polyphenylenevinylene: Partial<IExperiment> = {
  name: "Synthesis of poly(phenylene vinylene)",
  node: ["Experiment"],
};

export const exp_synth_42: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-42",
  node: ["Experiment"],
};

export const exp_synth_59: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-59",
  node: ["Experiment"],
};

export const exp_synth_72: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-72",
  node: ["Experiment"],
};

export const exp_synth_89: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-89",
  node: ["Experiment"],
};

export const exp_phase_behavior: Partial<IExperiment> = {
  name: "Phase Behavior Study",
  node: ["Experiment"],
};

export const experiments = [
  exp_phase_behavior,
  exp_synth_42,
  exp_synth_59,
  exp_synth_72,
  exp_synth_89,
  exp_synth_mol1,
  exp_synth_mol2,
  exp_synth_mol3,
  exp_synth_polyphenylenevinylene,
];
