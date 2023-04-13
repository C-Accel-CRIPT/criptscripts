
/**
 * @deprecated because identifiers are regular properties on IMaterial node.
 * 
 * The data model describe it differently: "Identifiers are a sub-object for the material node and are unique labels or descriptive information for a material (...)"
 * https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=16
 */
export interface IIdentifier {
  key: string;
  value: string | number | string[] | number[];
}
