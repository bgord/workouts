import type * as Exercises from "+exercises";
import type * as VO from "+plans/value-objects";

export type ExerciseCatalogItem = Exercises.VO.ExerciseWithCategories & VO.ExerciseWithProgressionMethods;

export type ExerciseCatalogResponse = { data: ReadonlyArray<ExerciseCatalogItem> };

export interface ListExerciseCatalog {
  execute(): Promise<ExerciseCatalogResponse>;
}
