import * as v from "valibot";
import * as Exercises from "+exercises";

export const WorkoutExerciseResistanceError = { invalid: "workout.exercise.resistance.invalid" };

export const WorkoutExerciseResistance = v.enum(
  Exercises.VO.ExerciseResistanceOptions,
  WorkoutExerciseResistanceError.invalid,
);
export type WorkoutExerciseResistanceType = v.InferOutput<typeof WorkoutExerciseResistance>;
