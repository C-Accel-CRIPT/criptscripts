import { ICitation } from "./ICitation"
import { ICondition } from "./ICondition";
import { IFile } from "./IFile";

/**
 * "Equipment are physical instruments, tools, glassware, etc. used in a process (...)"
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=21
 *
 * Typing is from from API's schema
 */
export interface IEquipment {
    key: string | undefined; // Not returned bu API yet. (@see https://trello.com/c/ZAR47EVX/10-equipment-schema-key-property-is-missing)
    citation?: ICitation[];
    condition?: ICondition[];
    created_at: string;
    description: string;
    file?: IFile[];
    model_version: string;
    node: ['Equipment'];
    uid: string;
    updated_at: string;
    uuid: string;
}