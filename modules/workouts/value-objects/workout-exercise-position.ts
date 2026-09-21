import * as tools from "@bgord/tools";
import * as v from "valibot";

// Stryker disable next-line StringLiteral
export const WorkoutExercisePosition = v.pipe(tools.IntegerNonNegative, v.brand("WorkoutExercisePosition"));
export type WorkoutExercisePositionType = v.InferOutput<typeof WorkoutExercisePosition>;
