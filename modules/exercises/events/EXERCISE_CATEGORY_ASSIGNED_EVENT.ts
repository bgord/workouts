import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_ASSIGNED_EVENT = "EXERCISE_CATEGORY_ASSIGNED_EVENT";

export const ExerciseCategoryAssignedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_ASSIGNED_EVENT),
  version: v.literal(2),
  payload: v.object({
    exerciseId: VO.ExerciseId,
    exerciseCategoryId: VO.ExerciseCategoryId,
    role: VO.ExerciseCategoryRole,
    requesterId: Auth.VO.UserId,
  }),
});

export type ExerciseCategoryAssignedEventType = v.InferOutput<typeof ExerciseCategoryAssignedEvent>;
