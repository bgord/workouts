import * as v from "valibot";
import { PlanNameMax, PlanNameMin } from "./plan-name.validation";

export const PlanNameError = { Type: "plan.name.type", Invalid: "plan.name.invalid" };

export const PlanName = v.pipe(
  v.string(PlanNameError.Type),
  v.minLength(PlanNameMin, PlanNameError.Invalid),
  v.maxLength(PlanNameMax, PlanNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("PlanName"),
);

export type PlanNameType = v.InferOutput<typeof PlanName>;
