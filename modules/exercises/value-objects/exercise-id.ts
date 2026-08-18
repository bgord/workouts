import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const ExerciseId = v.pipe(bg.UUID, v.brand("ExerciseId"));
export type ExerciseIdType = v.InferOutput<typeof ExerciseId>;
