import type { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as VO from "+exercises/value-objects";

export type ExerciseCategoryListResponse = {
  data: ReadonlyArray<VO.ExerciseCategory>;
  actions: { add: ActionState; rename: ActionState; delete: ActionState };
};

export interface ListExerciseCategories {
  execute(requesterId: Auth.VO.UserIdType): Promise<ExerciseCategoryListResponse>;
}
