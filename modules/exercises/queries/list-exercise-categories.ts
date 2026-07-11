import type * as VO from "+exercises/value-objects";

export interface ListExerciseCategories {
  execute(): Promise<ReadonlyArray<VO.ExerciseCategory>>;
}
