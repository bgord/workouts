import type { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as VO from "+exercises/value-objects";

export type ExerciseGetResponse = {
  data: VO.ExerciseWithCategories;
  actions: {
    update: ActionState;
    imageChange: ActionState;
    delete: ActionState;
    categoryAssign: ActionState;
    categoryUnassign: ActionState;
  };
};

export interface GetExerciseWithCategories {
  execute(
    exerciseId: VO.ExerciseIdType,
    requesterId: Auth.VO.UserIdType,
  ): Promise<ExerciseGetResponse | null>;
}
