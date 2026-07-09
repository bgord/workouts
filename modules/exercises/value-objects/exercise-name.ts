import * as v from "valibot";

export const ExerciseNameError = { Type: "exercise.name.type", Invalid: "exercise.name.invalid" };

// 3 to 64 letters or digits, or underscores allowed
const CHARS_WHITELIST = /^[a-zA-Z0-9_]{3,64}$/;

export const ExerciseName = v.pipe(
  v.string(ExerciseNameError.Type),
  v.regex(CHARS_WHITELIST, ExerciseNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseName"),
);

export type ExerciseNameType = v.InferOutput<typeof ExerciseName>;
