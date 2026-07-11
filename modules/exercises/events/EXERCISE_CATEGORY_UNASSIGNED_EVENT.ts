import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_UNASSIGNED_EVENT = "EXERCISE_CATEGORY_UNASSIGNED_EVENT";

export const ExerciseCategoryUnassignedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_UNASSIGNED_EVENT),
  payload: v.object({ exerciseId: VO.ExerciseId, exerciseCategoryId: VO.ExerciseCategoryId }),
});

export type ExerciseCategoryUnassignedEventType = v.InferOutput<typeof ExerciseCategoryUnassignedEvent>;
