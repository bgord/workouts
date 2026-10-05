import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+exercises/value-objects";

export const EXERCISE_RESISTANCE_CHANGED_EVENT = "EXERCISE_RESISTANCE_CHANGED_EVENT";

export const ExerciseResistanceChangedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(EXERCISE_RESISTANCE_CHANGED_EVENT),
  payload: v.object({ id: VO.ExerciseId, resistance: VO.ExerciseResistance, requesterId: Auth.VO.UserId }),
});

export type ExerciseResistanceChangedEventType = v.InferOutput<typeof ExerciseResistanceChangedEvent>;
