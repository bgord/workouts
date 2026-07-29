import * as v from "valibot";
import { ExerciseCategoryNameMax, ExerciseCategoryNameMin } from "./exercise-category-name.validation";

export const ExerciseCategoryNameError = {
  Type: "exercise.category.name.type",
  Invalid: "exercise.category.name.invalid",
};

// 3 to 64 letters or digits, and spaces allowed
const CHARS_WHITELIST = new RegExp(`^[a-zA-Z0-9 ]{${ExerciseCategoryNameMin},${ExerciseCategoryNameMax}}$`);

export const ExerciseCategoryName = v.pipe(
  v.string(ExerciseCategoryNameError.Type),
  v.regex(CHARS_WHITELIST, ExerciseCategoryNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseCategoryName"),
);

export type ExerciseCategoryNameType = v.InferOutput<typeof ExerciseCategoryName>;
