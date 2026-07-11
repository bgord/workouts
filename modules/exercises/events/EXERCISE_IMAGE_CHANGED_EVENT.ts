import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const EXERCISE_IMAGE_CHANGED_EVENT = "EXERCISE_IMAGE_CHANGED_EVENT";

export const ExerciseImageChangedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_IMAGE_CHANGED_EVENT),
  payload: v.object({ id: VO.ExerciseId, image: tools.ObjectKey }),
});

export type ExerciseImageChangedEventType = v.InferOutput<typeof ExerciseImageChangedEvent>;
