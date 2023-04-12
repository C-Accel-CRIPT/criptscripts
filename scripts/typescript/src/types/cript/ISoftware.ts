/**
 * "The software node contains metadata for a computation tool, code, programing language, or software package. (...)"
 * note: Software is a Node but does not share base attributes.
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=15
*/
export type ISoftware = {
    node: ['Software'];
    uuid: string;
    name: string;
    // notes: string; // Not returned by the API, not described in the data model either.
    version: string;
    source?: string;
}