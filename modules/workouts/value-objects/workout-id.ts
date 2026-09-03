import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const WorkoutId = v.pipe(bg.UUID, v.brand("WorkoutId"));
export type WorkoutIdType = v.InferOutput<typeof WorkoutId>;
