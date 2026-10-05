import {
  PlanDescriptionMax,
  PlanDescriptionMin,
} from "../../modules/plans/value-objects/plan-description.validation";

export const Form = {
  description: {
    pattern: { min: PlanDescriptionMin, max: PlanDescriptionMax, required: false },
    field: { name: "planDescription" },
  },
};
