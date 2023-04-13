/**
 * "A parameter is an input value to an algorithm. (...)"
 * @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=24
 */
export interface IParameter {
    key: string | undefined;
    value: string | undefined; // data model says any, but I decided to go with string until I have answers about that.
    unit: string | undefined;
};