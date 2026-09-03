import { PlanNameMax, PlanNameMin } from "../../modules/plans/value-objects/plan-name.validation";

export const Form = {
  name: { pattern: { min: PlanNameMin, max: PlanNameMax }, field: { name: "name" } },
};
