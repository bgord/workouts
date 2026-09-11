import * as v from "valibot";
import { ExerciseDescriptionMax, ExerciseDescriptionMin } from "./exercise-description.validation";

export const ExerciseDescriptionError = {
  Type: "exercise.description.type",
  Invalid: "exercise.description.invalid",
};

export const ExerciseDescription = v.pipe(
  v.string(ExerciseDescriptionError.Type),
  v.minLength(ExerciseDescriptionMin, ExerciseDescriptionError.Invalid),
  v.maxLength(ExerciseDescriptionMax, ExerciseDescriptionError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseDescription"),
);

export type ExerciseDescriptionType = v.InferOutput<typeof ExerciseDescription>;
