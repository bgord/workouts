import type { Exercise } from "./exercise";
import type { ExerciseCategory } from "./exercise-category";

export type ExerciseWithCategories = Exercise & { categories: ReadonlyArray<ExerciseCategory> };
