import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_DELETED_EVENT = "EXERCISE_DELETED_EVENT";

export const ExerciseDeletedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_DELETED_EVENT),
  payload: v.object({ id: VO.ExerciseId, image: tools.ObjectKey, userId: Auth.VO.UserId }),
});

export type ExerciseDeletedEventType = v.InferOutput<typeof ExerciseDeletedEvent>;
