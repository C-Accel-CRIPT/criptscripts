import { IComputation } from "@cript";
import * as datasets from "./datasets";

export const analysis_PPVbPI_42 = {
    name: '1/T Analysis PPV-b-PI-42',
    node: ['Computation'],
    input_data: [ datasets.saxs_ppvbpi_42]
} as IComputation;

export const peak_phase_id_PPVbPI_42 = {
    name: 'Peak Phase ID PPV-b-PI-42',
    node: ['Computation'],
    input_data: [ datasets.saxs_ppvbpi_42]
} as IComputation;

export const analysis_PPVbPI_59 = {
    name: '1/T Analysis PPV-b-PI-59',
    node: ['Computation'],
    input_data: [ datasets.saxs_ppvbpi_59]
} as IComputation;

export const peak_phase_id_PPVbPI_59 = {
    name: 'Peak Phase ID PPV-b-PI-59',
    node: ['Computation'],
    input_data: [ datasets.saxs_ppvbpi_59]
} as IComputation;

export const analysis_PPVbPI_72 = {
    name: '1/T Analysis PPV-b-PI-72',
    node: ['Computation'],
    input_data: [ datasets.saxs_ppvbpi_72]
} as IComputation;

export const peak_phase_id_PPVbPI_72 = {
    name: 'Peak Phase ID PPV-b-PI-72',
    node: ['Computation'],
    input_data: [ datasets.saxs_ppvbpi_72]
} as IComputation;