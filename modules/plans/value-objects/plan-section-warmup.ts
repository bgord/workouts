import * as v from "valibot";
import { PlanSectionWarmupMax, PlanSectionWarmupMin } from "./plan-section-warmup.validation";

export const PlanSectionWarmupError = {
  Type: "plan.section.warmup.type",
  Invalid: "plan.section.warmup.invalid",
};

export const PlanSectionWarmup = v.pipe(
  v.string(PlanSectionWarmupError.Type),
  v.minLength(PlanSectionWarmupMin, PlanSectionWarmupError.Invalid),
  v.maxLength(PlanSectionWarmupMax, PlanSectionWarmupError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("PlanSectionWarmup"),
);

export type PlanSectionWarmupType = v.InferOutput<typeof PlanSectionWarmup>;
