import * as v from "valibot";

export const PlanNameError = { Type: "plan.name.type", Invalid: "plan.name.invalid" };

// 3 to 64 letters or digits, and spaces allowed
const CHARS_WHITELIST = /^[a-zA-Z0-9 ]{3,64}$/;

export const PlanName = v.pipe(
  v.string(PlanNameError.Type),
  v.regex(CHARS_WHITELIST, PlanNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("PlanName"),
);

export type PlanNameType = v.InferOutput<typeof PlanName>;
