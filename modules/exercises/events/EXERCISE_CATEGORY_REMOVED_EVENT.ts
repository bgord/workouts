import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_REMOVED_EVENT = "EXERCISE_CATEGORY_REMOVED_EVENT";

export const ExerciseCategoryRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_REMOVED_EVENT),
  payload: v.object({ exerciseId: VO.ExerciseId, exerciseCategoryId: VO.ExerciseCategoryId }),
});

export type ExerciseCategoryRemovedEventType = v.InferOutput<typeof ExerciseCategoryRemovedEvent>;
