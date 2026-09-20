import {
  PlanSectionCooldownMax,
  PlanSectionCooldownMin,
} from "../../modules/plans/value-objects/plan-section-cooldown.validation";

export const Form = {
  cooldown: {
    pattern: { min: PlanSectionCooldownMin, max: PlanSectionCooldownMax, required: false },
    field: { name: "planSectionCooldown" },
  },
};
