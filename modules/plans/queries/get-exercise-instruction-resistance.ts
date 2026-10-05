import type * as Exercises from "+exercises";
import type * as VO from "+plans/value-objects";

export interface GetExerciseInstructionResistance {
  execute(
    exerciseInstructionId: VO.ExerciseInstructionIdType,
  ): Promise<Exercises.VO.ExerciseResistanceType | null>;
}
