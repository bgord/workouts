import type * as Exercises from "+exercises";
import type * as VO from "+plans/value-objects";

export interface GetExerciseInstructionLoading {
  execute(
    exerciseInstructionId: VO.ExerciseInstructionIdType,
  ): Promise<Exercises.VO.ExerciseLoadingType | null>;
}
