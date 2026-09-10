import * as v from "valibot";
import { ExerciseNameMax, ExerciseNameMin } from "./exercise-name.validation";

export const ExerciseNameError = { Type: "exercise.name.type", Invalid: "exercise.name.invalid" };

// 3 to 64 letters or digits, and spaces allowed
const CHARS_WHITELIST = new RegExp(`^[a-zA-Z0-9 ]{${ExerciseNameMin},${ExerciseNameMax}}$`);

export const ExerciseName = v.pipe(
  v.string(ExerciseNameError.Type),
  v.regex(CHARS_WHITELIST, ExerciseNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseName"),
);

export type ExerciseNameType = v.InferOutput<typeof ExerciseName>;
