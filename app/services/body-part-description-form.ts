import {
  BodyPartDescriptionMax,
  BodyPartDescriptionMin,
} from "../../modules/measurements/value-objects/body-part-description.validation";

export const Form = {
  description: {
    pattern: { min: BodyPartDescriptionMin, max: BodyPartDescriptionMax, required: false },
    field: { name: "bodyPartDescription" },
  },
};
