import * as v from "valibot";
import { PlanDescriptionMax, PlanDescriptionMin } from "./plan-description.validation";

export const PlanDescriptionError = { Type: "plan.description.type", Invalid: "plan.description.invalid" };

export const PlanDescription = v.pipe(
  v.string(PlanDescriptionError.Type),
  v.minLength(PlanDescriptionMin, PlanDescriptionError.Invalid),
  v.maxLength(PlanDescriptionMax, PlanDescriptionError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("PlanDescription"),
);

export type PlanDescriptionType = v.InferOutput<typeof PlanDescription>;
