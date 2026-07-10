import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+exercises/value-objects";

export const EXERCISE_UPDATED_EVENT = "EXERCISE_UPDATED_EVENT";

export const ExerciseUpdatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_UPDATED_EVENT),
  payload: v.object({ id: VO.ExerciseId, name: VO.ExerciseName, description: VO.ExerciseDescription }),
});

export type ExerciseAddedEventExerciseUpdatedEventType = v.InferOutput<typeof ExerciseUpdatedEvent>;
