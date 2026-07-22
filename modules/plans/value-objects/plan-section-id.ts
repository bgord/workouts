import * as bg from "@bgord/bun";
import * as v from "valibot";

export const PlanSectionId = v.pipe(bg.UUID, v.brand("PlanSectionId"));
export type PlanSectionIdType = v.InferOutput<typeof PlanSectionId>;
