import { IProperty } from "@cript";
import { Chi } from "pppdb/types";
import { createPropertyObject, PropertyType } from "./create-base-property-object";
import { PPPDBLoader } from "pppdb/pppdb-loader";

// Add properties depending on 'type'
// We only handle Type 1 to 3 here. We discard 4 and 5 at the very beginning of the loop.

export const createChiParameters = ({
  chi_row,
  isMixture,
  shared_by_all_properties,
  combined_material,
  loader_instance,
}: {
  chi_row: Chi;
  isMixture: boolean;
  shared_by_all_properties: any;
  combined_material: { property: IProperty[] };
  loader_instance: PPPDBLoader;
}) => {
  const sharedProperties = isMixture
    ? shared_by_all_properties
    : {
        ...shared_by_all_properties,
        structure: chi_row.BigSMILEScombined,
      };

  switch (chi_row.type) {
    case "Type 1":
      if (chi_row.chinumber !== undefined) {
        // If "chimax" is not defined, we interpret "chinumber" as "interaction_param" ("value")
        if (chi_row.chimax === undefined) {
          loader_instance.validate_and_push_property(
            combined_material,
            createPropertyObject({
              type: PropertyType.value,
              value: chi_row.chinumber,
              uncertainty: chi_row.chierror,
              ...sharedProperties,
            }) satisfies IProperty
          );

          // Otherwise, we interpret "chinumber" - "interaction_param - "min" and "chimax" as "max".
        } else {
          // interaction param (min)
          loader_instance.validate_and_push_property(
            combined_material,
            createPropertyObject({
              type: PropertyType.min,
              value: chi_row.chinumber,
              ...sharedProperties,
            })
          );

          // interaction param (max)
          loader_instance.validate_and_push_property(
            combined_material,
            createPropertyObject({
              value: chi_row.chimax,
              ...((!isMixture && !!chi_row.BigSMILEScombined && { structure: chi_row.BigSMILEScombined }) as any),
              ...sharedProperties,
            })
          );
        }
      } else if (chi_row.chimax) {
        loader_instance.logger.warning(`chinumber is undefined but chimax is defined, interaction_param skipped`);
      }

      break;

    case "Type 3":
      if (chi_row.chic) {
        loader_instance.validate_and_push_property(
          combined_material,
          createPropertyObject({
            key: "interaction_param_c",
            value: chi_row.chic,
            uncertainty: chi_row.chicerror,
            unit: "K**2",
            // unit: undefined, // on purpose
            ...sharedProperties,
          })
        );
      }
    // break; // on purpose, see next case

    case "Type 2" /* or 'Type 3'*/:
      if (chi_row.chia) {
        loader_instance.validate_and_push_property(
          combined_material,
          createPropertyObject({
            key: "interaction_param_a",
            value: chi_row.chia,
            uncertainty: chi_row.chiaerror,
            ...sharedProperties,
          })
        );
      }

      if (chi_row.chib) {
        loader_instance.validate_and_push_property(
          combined_material,
          createPropertyObject({
            key: "interaction_param_b",
            value: chi_row.chib,
            uncertainty: chi_row.chiberror,
            unit: "K",
            ...sharedProperties,
          })
        );
      }
      break;
    default:
      const unhandled_type = chi_row.type; // compile-time check
      throw new Error(`Unhandled type: '${unhandled_type}'`); // runtime check
  }
};
