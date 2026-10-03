import * as v from "valibot";
import * as Exercises from "+exercises";

export const WorkoutExerciseLoadingError = { invalid: "workout.exercise.loading.invalid" };

export const WorkoutExerciseLoading = v.enum(
  Exercises.VO.ExerciseLoadingOptions,
  WorkoutExerciseLoadingError.invalid,
);
export type WorkoutExerciseLoadingType = v.InferOutput<typeof WorkoutExerciseLoading>;
