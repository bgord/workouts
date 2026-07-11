import * as v from "valibot";

export const ExerciseCategoryNameError = {
  Type: "exercise.category.name.type",
  Invalid: "exercise.category.name.invalid",
};

// 3 to 64 letters or digits, and spaces allowed
const CHARS_WHITELIST = /^[a-zA-Z0-9 ]{3,64}$/;

export const ExerciseCategoryName = v.pipe(
  v.string(ExerciseCategoryNameError.Type),
  v.regex(CHARS_WHITELIST, ExerciseCategoryNameError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("ExerciseCategoryName"),
);

export type ExerciseCategoryNameType = v.InferOutput<typeof ExerciseCategoryName>;
