import type * as VO from "+exercises/value-objects";

export interface ListExercisesWithCategories {
  execute(): Promise<ReadonlyArray<VO.ExerciseWithCategories>>;
}
