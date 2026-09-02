import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_CATEGORY_RENAMED_EVENT = "EXERCISE_CATEGORY_RENAMED_EVENT";

export const ExerciseCategoryRenamedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_CATEGORY_RENAMED_EVENT),
  payload: v.object({ id: VO.ExerciseCategoryId, name: VO.ExerciseCategoryName, userId: Auth.VO.UserId }),
});

export type ExerciseCategoryRenamedEventType = v.InferOutput<typeof ExerciseCategoryRenamedEvent>;
