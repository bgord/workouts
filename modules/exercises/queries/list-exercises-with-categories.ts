import * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+exercises/value-objects";

export type ExerciseListResponse = {
  data: ReadonlyArray<VO.ExerciseWithCategories>;
  actions: { add: bg.ActionState };
};

export interface ListExercisesWithCategories {
  execute(requesterId: Auth.VO.UserIdType): Promise<ExerciseListResponse>;
}
