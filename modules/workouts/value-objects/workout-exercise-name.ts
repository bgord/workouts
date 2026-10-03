import * as v from "valibot";

export const WorkoutExerciseNameError = { Type: "workout.exercise.name.type" };

export const WorkoutExerciseName = v.pipe(
  v.string(WorkoutExerciseNameError.Type),
  // Stryker disable next-line StringLiteral
  v.brand("WorkoutExerciseName"),
);

export type WorkoutExerciseNameType = v.InferOutput<typeof WorkoutExerciseName>;
