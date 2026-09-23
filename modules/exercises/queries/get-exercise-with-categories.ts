import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+exercises/value-objects";

export type ExerciseGetResponse = {
  data: VO.ExerciseWithCategories;
  assignableCategories: ReadonlyArray<VO.ExerciseCategory>;
  actions: {
    update: bg.ActionState;
    imageChange: bg.ActionState;
    delete: bg.ActionState;
    categoryAssign: bg.ActionState;
    categoryUnassign: bg.ActionState;
  };
};

export interface GetExerciseWithCategories {
  execute(
    exerciseId: VO.ExerciseIdType,
    requesterId: Auth.VO.UserIdType,
  ): Promise<ExerciseGetResponse | null>;
}
