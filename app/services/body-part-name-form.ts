import {
  BodyPartNameMax,
  BodyPartNameMin,
} from "../../modules/measurements/value-objects/body-part-name.validation";

export const Form = {
  name: { pattern: { min: BodyPartNameMin, max: BodyPartNameMax }, field: { name: "name" } },
};
