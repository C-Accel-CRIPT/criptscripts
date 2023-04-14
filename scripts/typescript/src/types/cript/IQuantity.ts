
/**
 * "Quantities are the amount of material involved in a process. They are used in the ingredients subobject. (...)"
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=21
 */
export type IQuantity = {
    key: string;
    type: string;
    unit: string;
    value: number;
};
