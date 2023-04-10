import { ICollection, IExperiment } from "../afrl/types/cript";
import { default_notes } from "./shared";
import { experiments } from './experiments';

export const collection: Partial<ICollection> = {
    name: 'Olsen et al. PPV-b-PI',
    notes: default_notes,
    inventory: [],
    experiment: experiments as IExperiment[]
}