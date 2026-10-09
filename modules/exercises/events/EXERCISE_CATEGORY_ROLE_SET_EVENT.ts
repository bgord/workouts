import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_ROLE_SET_EVENT = "EXERCISE_CATEGORY_ROLE_SET_EVENT";

export const ExerciseCategoryRoleSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_ROLE_SET_EVENT),
  payload: v.object({
    exerciseId: VO.ExerciseId,
    exerciseCategoryId: VO.ExerciseCategoryId,
    role: VO.ExerciseCategoryRole,
    requesterId: Auth.VO.UserId,
  }),
});

export type ExerciseCategoryRoleSetEventType = v.InferOutput<typeof ExerciseCategoryRoleSetEvent>;
