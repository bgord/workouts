import * as v from "valibot";
import { PlanSectionCooldownMax, PlanSectionCooldownMin } from "./plan-section-cooldown.validation";

export const PlanSectionCooldownError = {
  Type: "plan.section.cooldown.type",
  Invalid: "plan.section.cooldown.invalid",
};

export const PlanSectionCooldown = v.pipe(
  v.string(PlanSectionCooldownError.Type),
  v.minLength(PlanSectionCooldownMin, PlanSectionCooldownError.Invalid),
  v.maxLength(PlanSectionCooldownMax, PlanSectionCooldownError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("PlanSectionCooldown"),
);

export type PlanSectionCooldownType = v.InferOutput<typeof PlanSectionCooldown>;
