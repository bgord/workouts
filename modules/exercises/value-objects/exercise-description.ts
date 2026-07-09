import * as v from "valibot";

export const ExerciseDescriptionError = {
  Type: "exercise.description.type",
  Invalid: "exercise.description.invalid",
};

// 3 to 256 letters or digits, or underscores allowed
const CHARS_WHITELIST = /^[a-zA-Z0-9_]{3,256}$/;

export const ExerciseDescription = v.pipe(
  v.string(ExerciseDescriptionError.Type),
  v.regex(CHARS_WHITELIST, ExerciseDescriptionError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseDescription"),
);

export type ExerciseDescriptionType = v.InferOutput<typeof ExerciseDescription>;
