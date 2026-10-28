import type * as VO from "+exercises/value-objects";

export interface ListExercisesForCatalog {
  execute(): Promise<ReadonlyArray<VO.ExerciseWithCategories>>;
}
