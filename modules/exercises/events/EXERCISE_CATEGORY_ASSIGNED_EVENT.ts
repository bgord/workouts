import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_ASSIGNED_EVENT = "EXERCISE_CATEGORY_ASSIGNED_EVENT";

export const ExerciseCategoryAssignedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_ASSIGNED_EVENT),
  payload: v.object({ exerciseId: VO.ExerciseId, exerciseCategoryId: VO.ExerciseCategoryId }),
});

export type ExerciseCategoryAssignedEventType = v.InferOutput<typeof ExerciseCategoryAssignedEvent>;
