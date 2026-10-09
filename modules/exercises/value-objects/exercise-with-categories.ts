import type { Exercise } from "./exercise";
import type { ExerciseCategoryAssignment } from "./exercise-category-assignment";

export type ExerciseWithCategories = Exercise & { categories: ReadonlyArray<ExerciseCategoryAssignment> };
