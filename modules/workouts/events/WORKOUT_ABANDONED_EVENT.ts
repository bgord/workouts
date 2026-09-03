import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_ABANDONED_EVENT = "WORKOUT_ABANDONED_EVENT";

export const WorkoutAbandonedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_ABANDONED_EVENT),
  payload: v.object({ workoutId: VO.WorkoutId, requesterId: Auth.VO.UserId }),
});

export type WorkoutAbandonedEventType = v.InferOutput<typeof WorkoutAbandonedEvent>;
