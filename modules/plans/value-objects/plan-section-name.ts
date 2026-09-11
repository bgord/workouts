import * as v from "valibot";
import { PlanSectionNameMax, PlanSectionNameMin } from "./plan-section-name.validation";

export const PlanSectionNameError = { Type: "plan.section.name.type", Invalid: "plan.section.name.invalid" };

export const PlanSectionName = v.pipe(
  v.string(PlanSectionNameError.Type),
  v.minLength(PlanSectionNameMin, PlanSectionNameError.Invalid),
  v.maxLength(PlanSectionNameMax, PlanSectionNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("PlanSectionName"),
);

export type PlanSectionNameType = v.InferOutput<typeof PlanSectionName>;
