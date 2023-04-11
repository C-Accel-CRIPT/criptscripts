import { IData, IExperiment, IProcess } from "@cript";
import * as datasets from "./datasets";
import * as processes from "./processes";
import * as computations from "./computations";

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
  ] as IProcess[],
};

// Note: synth_xx are very similar in term of structure

export const synth_42: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-42",
  node: ["Experiment"],
  data: [datasets.gpc_pi_synth_42 as IData],
  process: [
    processes.anionic_polymerization_synth_42,
    processes.react_for_30mn_synth_42,
    processes.terminate_remaining_synth_42,
    processes.precipitate_with_methanol_synth_42,
    processes.remove_homopolymer_with_synth_42,
  ] as IProcess[],
};

export const synth_59: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-59",
  node: ["Experiment"],
  data: [datasets.gpc_pi_synth_59 as IData],
  process: [
    processes.anionic_polymerization_synth_59,
    processes.react_for_30mn_synth_59,
    processes.terminate_remaining_synth_59,
    processes.precipitate_with_methanol_synth_59,
    processes.remove_homopolymer_with_synth_59,
  ] as IProcess[],
};

export const synth_72: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-72",
  node: ["Experiment"],
  data: [datasets.gpc_pi_synth_72 as IData],
  process: [
    processes.anionic_polymerization_synth_72,
    processes.react_for_30mn_synth_72,
    processes.terminate_remaining_synth_72,
    processes.precipitate_with_methanol_synth_72,
    processes.remove_homopolymer_with_synth_72,
  ] as IProcess[],
};

export const synth_89: Partial<IExperiment> = {
  name: "Synthesis of PPVbPI-89",
  node: ["Experiment"],
  data: [datasets.gpc_pi_synth_89 as IData],
  process: [
    processes.anionic_polymerization_synth_89,
    processes.react_for_30mn_synth_89,
    processes.terminate_remaining_synth_89,
    processes.precipitate_with_methanol_synth_89,
    processes.remove_homopolymer_with_synth_89,
  ] as IProcess[],
};

export const phase_behavior: Partial<IExperiment> = {
  name: "Phase Behavior Study",
  node: ["Experiment"],
  computation: [
    
    computations.analysis_PPVbPI_42,
    computations.analysis_PPVbPI_59,
    computations.analysis_PPVbPI_72,
    computations.analysis_PPVbPI_89,

    computations.peak_phase_id_PPVbPI_42,
    computations.peak_phase_id_PPVbPI_59,
    computations.peak_phase_id_PPVbPI_72,
    computations.peak_phase_id_PPVbPI_89,
  ],
};
