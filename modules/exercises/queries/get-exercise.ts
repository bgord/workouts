import type * as VO from "+exercises/value-objects";

export interface GetExercise {
  execute(exerciseId: VO.ExerciseIdType): Promise<VO.Exercise | null>;
}
