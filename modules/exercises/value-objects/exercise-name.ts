import * as v from "valibot";
import { ExerciseNameMax, ExerciseNameMin } from "./exercise-name.validation";

export const ExerciseNameError = { Type: "exercise.name.type", Invalid: "exercise.name.invalid" };

export const ExerciseName = v.pipe(
  v.string(ExerciseNameError.Type),
  v.minLength(ExerciseNameMin, ExerciseNameError.Invalid),
  v.maxLength(ExerciseNameMax, ExerciseNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseName"),
);

export type ExerciseNameType = v.InferOutput<typeof ExerciseName>;
