import type * as VO from "+exercises/value-objects";

export interface ListExercisesAssignedToCategory {
  execute(exerciseCategoryId: VO.ExerciseCategoryIdType): Promise<ReadonlyArray<VO.Exercise>>;
}
