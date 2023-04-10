/**
 * The purpose of this script is to declare the Graph (defined in https://docs.google.com/presentation/d/1eXM7870YM2sxQQvMFahI2Ox8-EFCGaw_/edit#slide=id.p1)
 * and export it as a JSON file. 
 */

import { ICollection, IExperiment, IProject } from "../afrl/types/cript";
import { write_json_helper } from "../utils/json";

const default_notes = 'exported from https://github.com/C-Accel-CRIPT/criptscripts/typescript/';

const project: Partial<IProject> = {
    name: 'CRIPT End-to-End Test Papers',
    notes: default_notes,
    material: [],
    collection: [],
    node: ['Project'],
    model_version: "1.0.0"
}

const collection: Partial<ICollection> = {
    name: 'Olsen et al. PPV-b-PI',
    notes: default_notes,
    inventory: [],
    experiment: []
}
project.collection?.push(collection as any);

const experiments: Partial<IExperiment>[] = [
    {
        name: 'Synthesis of molecule 1 ((2,5-Di(2′-ethylhexyloxy)toluene))',
        node: ['Experiment']
    },
    {
        name: 'Synthesis of molecule 2 (2,5-Di(2′-ethylhexyloxy)toluene)',
        node: ['Experiment']
    },
    {
        name: 'Synthesis of molecule 3 (2′,5′-Di(2′′-ethylhexyloxy)-4′-methyl-N- benzylideneaniline)',
        node: ['Experiment']
    },
    {
        name: 'Synthesis of poly(phenylene vinylene)',
        node: ['Experiment']
    },
    {
        name: 'Synthesis of PPVbPI-42',
        node: ['Experiment']
    },
    {
        name: 'Synthesis of PPVbPI-59',
        node: ['Experiment']
    },
    {
        name: 'Synthesis of PPVbPI-72',
        node: ['Experiment']
    },
    {
        name: 'Synthesis of PPVbPI-89',
        node: ['Experiment']
    },
    {
        name: 'Phase Behavior Study',
        node: ['Experiment']
    }
]
collection.experiment?.push(...experiments as any);

console.log(`RCBC JSON is:\n\n${JSON.stringify(project, null, ' ')}`)

write_json_helper(project, 'rcbc-transformation', 'human-readable');
write_json_helper(project, 'rcbc-transformation', 'minified');