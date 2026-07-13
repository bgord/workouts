import type * as VO from "+exercises/value-objects";

export interface ListCategoriesAssignedToExercise {
  execute(exerciseId: VO.ExerciseIdType): Promise<ReadonlyArray<VO.ExerciseCategory>>;
}
