import { IParameter, ICitation } from '.';

/**
 * "Algorithm consists of parameter and condition details used in the computation and computational_process. (...)""
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=24
 */
export type IAlgorithm = {
    key: string;
    type: string;
    parameter: Array<IParameter>;
    citation: Array<ICitation>;
};