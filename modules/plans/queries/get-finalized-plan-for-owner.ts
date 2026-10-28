import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as VO from "+plans/value-objects";

export type FinalizedPlanForOwner = {
  id: VO.PlanIdType;
  name: VO.PlanNameType;
  sections: ReadonlyArray<{
    id: VO.PlanSectionIdType;
    name: VO.PlanSectionNameType;
    exerciseInstructions: ReadonlyArray<{
      id: VO.ExerciseInstructionIdType;
      exercise: { name: Exercises.VO.ExerciseNameType };
    }>;
  }>;
};

export interface GetFinalizedPlanForOwner {
  execute(userId: Auth.VO.UserIdType): Promise<FinalizedPlanForOwner | null>;
}
