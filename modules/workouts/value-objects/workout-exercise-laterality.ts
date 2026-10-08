import * as v from "valibot";
import * as Exercises from "+exercises";

export const WorkoutExerciseLateralityError = { invalid: "workout.exercise.laterality.invalid" };

export const WorkoutExerciseLaterality = v.enum(
  Exercises.VO.ExerciseLateralityOptions,
  WorkoutExerciseLateralityError.invalid,
);
export type WorkoutExerciseLateralityType = v.InferOutput<typeof WorkoutExerciseLaterality>;
