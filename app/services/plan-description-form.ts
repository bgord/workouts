import {
  PlanDescriptionMax,
  PlanDescriptionMin,
} from "../../modules/plans/value-objects/plan-description.validation";

export const Form = {
  description: {
    pattern: { min: PlanDescriptionMin, max: PlanDescriptionMax },
    field: { name: "planDescription" },
  },
};
