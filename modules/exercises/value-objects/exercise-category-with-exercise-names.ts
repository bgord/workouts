import type { ExerciseCategory } from "./exercise-category";
import type { ExerciseNameType } from "./exercise-name";

export type ExerciseCategoryWithExerciseNames = ExerciseCategory & {
  exerciseNames: ReadonlyArray<ExerciseNameType>;
};
