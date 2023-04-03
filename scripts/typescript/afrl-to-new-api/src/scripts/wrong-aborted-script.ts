
// Load data
import { data } from '../data/data'
import { IMaterial } from '../types/cript'

type Options = {
    log: boolean;
    log_input_data: boolean;
}

export const main = (options: Partial<Options> = { 
    log_input_data: false,
    log: true
}) => {

    const log = options.log ?
    (...args: any[]) => console.log(args) :  (...args: any[]) => {}

    log( JSON.stringify(data, null, ' ') );

    // Convert to cript material
    const materials: IMaterial[] = [];
    if(options.log) log(`Converting data (${data.length})...`);
    for (let each of data.slice(0,20)) {
        each.reference
        materials.push({
            name: each.polymer,
            smiles: each.polymer_SMILES,
            cas: each.polymer_CAS,
            notes: `From AFRL data: ${each.reference}`,
            component: [{
                name: each.solvent,
                smiles: each.solvent_SMILES,
                cas: each.solvent_CAS,
            }]
        } as IMaterial)
    }
    log(`Converting data OK`);

    // Log materials
    log(`Logging CRIPT materials (${materials.length})...`);
    log(`${JSON.stringify(materials, null, ' ')}`);
    log(`Logging done.`);
}