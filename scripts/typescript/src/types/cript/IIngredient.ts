import { IMaterial, IQuantity } from "./index";

/**
 * "Ingredients are links to material nodes with the associated quantities. (...)"
 * Data model says @see https://chemrxiv.org/engage/api-gateway/chemrxiv/assets/orp/resource/item/6322994103e27d9176d5b10c/original/main-supporting-information.pdf#page=21
 * backend reference:
 * "IngredientPost": {
        "$id": "IngredientPost",
        "additionalProperties": false,
        "properties": {
          "created_at": {
            "default": "now()",
            "format": "date-time",
            "readOnly": true,
            "type": "string"
          },
          "keyword": {
            "enum": [
              "monomer",
              "polymer",
              "initiator",
              "catalyst",
              "solvent",
              "cta",
              "quench",
              "reagent",
              "workup",
              "intermediate",
              "computation",
              "filler",
              "matrix",
              "inert_carrier_gas"
            ],
            "item": {
              "type": "string"
            },
            "type": "array"
          },
          "material": {
            "$ref": "MaterialPost"
          },
          "model_version": {
            "$ref": "ModelVersion"
          },
          "node": {
            "const": "Ingredient",
            "type": "string"
          },
          "quantity": {
            "item": {
              "$ref": "QuantityPost"
            },
            "type": "array"
          },
          "updated_at": {
            "default": "now()",
            "format": "date-time",
            "readOnly": true,
            "type": "string"
          },
          "uuid": {
            "default": "uuid()",
            "readOnly": true,
            "type": "string"
          }
        },
        "required": [
          "node",
          "material"
        ],
        "type": "object"
      } 
*/
export interface IIngredient {
  material?: IMaterial[];
  quantity?: IQuantity[];
  created_at?: string;
  keyword?: string[];
  model_version?: string;
  node: ['Ingredient'];
  updated_at?: string;
  uuid?: string;
}
