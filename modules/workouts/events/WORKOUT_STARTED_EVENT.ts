import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_STARTED_EVENT = "WORKOUT_STARTED_EVENT";

export const WorkoutStartedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_STARTED_EVENT),
  payload: v.object({ workoutId: VO.WorkoutId, requesterId: Auth.VO.UserId }),
});

export type WorkoutStartedEventType = v.InferOutput<typeof WorkoutStartedEvent>;
