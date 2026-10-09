import * as v from "valibot";
import { ExerciseCategoryRoleOptions } from "./exercise-category-role-options";

export const ExerciseCategoryRoleError = { invalid: "exercise.category.role.invalid" };

export const ExerciseCategoryRole = v.enum(ExerciseCategoryRoleOptions, ExerciseCategoryRoleError.invalid);
export type ExerciseCategoryRoleType = v.InferOutput<typeof ExerciseCategoryRole>;
