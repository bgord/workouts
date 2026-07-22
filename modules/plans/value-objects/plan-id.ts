import * as bg from "@bgord/bun";
import * as v from "valibot";

export const PlanId = v.pipe(bg.UUID, v.brand("PlanId"));
export type PlanIdType = v.InferOutput<typeof PlanId>;
