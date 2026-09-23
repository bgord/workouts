import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+exercises/value-objects";

export type ExerciseCategoryListResponse = {
  data: ReadonlyArray<VO.ExerciseCategory>;
  actions: { manage: bg.ActionState; add: bg.ActionState; rename: bg.ActionState; delete: bg.ActionState };
};

export interface ListExerciseCategories {
  execute(requesterId: Auth.VO.UserIdType): Promise<ExerciseCategoryListResponse>;
}
