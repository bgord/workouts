import type { ExerciseCategory } from "./exercise-category";
import type { ExerciseCategoryRoleType } from "./exercise-category-role";

export type ExerciseCategoryAssignment = ExerciseCategory & { role: ExerciseCategoryRoleType };
