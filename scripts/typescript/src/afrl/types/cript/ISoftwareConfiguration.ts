import { ICitation, ISoftware, IAlgorithm } from ".";

/**
 * The software_configuration sub-object includes software and the set of algorithms to execute computation or computational_process.
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=23
 */
export type ISoftwareConfiguration = {
    key: string;
    software: ISoftware;
    algorithms: IAlgorithm[];
    notes: string;
    citations: ICitation[];
}