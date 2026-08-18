import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const PlanSectionId = v.pipe(bg.UUID, v.brand("PlanSectionId"));
export type PlanSectionIdType = v.InferOutput<typeof PlanSectionId>;
