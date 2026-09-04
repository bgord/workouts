import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_DISCARDED_EVENT = "WORKOUT_DISCARDED_EVENT";

export const WorkoutDiscardedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_DISCARDED_EVENT),
  payload: v.object({ workoutId: VO.WorkoutId, requesterId: Auth.VO.UserId }),
});

export type WorkoutDiscardedEventType = v.InferOutput<typeof WorkoutDiscardedEvent>;
