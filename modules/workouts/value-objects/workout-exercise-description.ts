import * as v from "valibot";

export const WorkoutExerciseDescriptionError = { Type: "workout.exercise.description.type" };

export const WorkoutExerciseDescription = v.pipe(
  v.string(WorkoutExerciseDescriptionError.Type),
  // Stryker disable next-line StringLiteral
  v.brand("WorkoutExerciseDescription"),
);

export type WorkoutExerciseDescriptionType = v.InferOutput<typeof WorkoutExerciseDescription>;
