import {
  PlanSectionNameMax,
  PlanSectionNameMin,
} from "../../modules/plans/value-objects/plan-section-name.validation";

export const Form = {
  planSectionName: {
    pattern: { min: PlanSectionNameMin, max: PlanSectionNameMax },
    field: { name: "planSectionName" },
  },
};
