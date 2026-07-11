import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_ADDED_EVENT = "EXERCISE_CATEGORY_ADDED_EVENT";

export const ExerciseCategoryAddedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_ADDED_EVENT),
  payload: v.object({ id: VO.ExerciseId, name: VO.ExerciseCategoryName }),
});

export type ExerciseCategoryAddedEventType = v.InferOutput<typeof ExerciseCategoryAddedEvent>;
