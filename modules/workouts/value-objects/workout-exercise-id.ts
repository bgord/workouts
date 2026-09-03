import * as bg from "@bgord/bun";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const WorkoutExerciseId = v.pipe(bg.UUID, v.brand("WorkoutExerciseId"));
export type WorkoutExerciseIdType = v.InferOutput<typeof WorkoutExerciseId>;
