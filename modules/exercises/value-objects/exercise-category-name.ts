import * as v from "valibot";
import { ExerciseCategoryNameMax, ExerciseCategoryNameMin } from "./exercise-category-name.validation";

export const ExerciseCategoryNameError = {
  Type: "exercise.category.name.type",
  Invalid: "exercise.category.name.invalid",
};

export const ExerciseCategoryName = v.pipe(
  v.string(ExerciseCategoryNameError.Type),
  v.minLength(ExerciseCategoryNameMin, ExerciseCategoryNameError.Invalid),
  v.maxLength(ExerciseCategoryNameMax, ExerciseCategoryNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseCategoryName"),
);

export type ExerciseCategoryNameType = v.InferOutput<typeof ExerciseCategoryName>;
