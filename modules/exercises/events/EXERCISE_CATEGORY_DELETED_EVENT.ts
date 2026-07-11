import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_DELETED_EVENT = "EXERCISE_CATEGORY_DELETED_EVENT";

export const ExerciseCategoryDeletedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_DELETED_EVENT),
  payload: v.object({ id: VO.ExerciseId }),
});

export type ExerciseCategoryDeletedEventType = v.InferOutput<typeof ExerciseCategoryDeletedEvent>;
