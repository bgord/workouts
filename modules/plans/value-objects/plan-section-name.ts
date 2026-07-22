import * as v from "valibot";

export const PlanSectionNameError = { Type: "plan.section.name.type", Invalid: "plan.section.name.invalid" };

// 3 to 64 letters or digits, and spaces allowed
const CHARS_WHITELIST = /^[a-zA-Z0-9 ]{3,64}$/;

export const PlanSectionName = v.pipe(
  v.string(PlanSectionNameError.Type),
  v.regex(CHARS_WHITELIST, PlanSectionNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("PlanSectionName"),
);

export type PlanSectionNameType = v.InferOutput<typeof PlanSectionName>;
