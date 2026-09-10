import * as v from "valibot";
import { ExerciseDescriptionMax, ExerciseDescriptionMin } from "./exercise-description.validation";

export const ExerciseDescriptionError = {
  Type: "exercise.description.type",
  Invalid: "exercise.description.invalid",
};

// 3 to 256 letters or digits, or spaces, commas, and dots allowed
const CHARS_WHITELIST = new RegExp(`^[a-zA-Z0-9,. ]{${ExerciseDescriptionMin},${ExerciseDescriptionMax}}$`);

export const ExerciseDescription = v.pipe(
  v.string(ExerciseDescriptionError.Type),
  v.regex(CHARS_WHITELIST, ExerciseDescriptionError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseDescription"),
);

export type ExerciseDescriptionType = v.InferOutput<typeof ExerciseDescription>;
