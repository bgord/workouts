import type * as VO from "+exercises/value-objects";

export interface GetExerciseCategory {
  execute(exerciseCategoryId: VO.ExerciseCategoryIdType): Promise<VO.ExerciseCategory | null>;
}
