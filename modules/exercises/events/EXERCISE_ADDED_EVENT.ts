import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_ADDED_EVENT = "EXERCISE_ADDED_EVENT";

export const ExerciseAddedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_ADDED_EVENT),
  payload: v.object({
    id: VO.ExerciseId,
    name: VO.ExerciseName,
    description: VO.ExerciseDescription,
    image: tools.ObjectKey,
    imageEtag: bg.HashValue,
    userId: Auth.VO.UserId,
  }),
});

export type ExerciseAddedEventType = v.InferOutput<typeof ExerciseAddedEvent>;
