import {
  PlanSectionWarmupMax,
  PlanSectionWarmupMin,
} from "../../modules/plans/value-objects/plan-section-warmup.validation";

export const Form = {
  warmup: {
    pattern: { min: PlanSectionWarmupMin, max: PlanSectionWarmupMax, required: false },
    field: { name: "planSectionWarmup" },
  },
};
