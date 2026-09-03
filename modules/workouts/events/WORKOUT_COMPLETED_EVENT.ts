import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_COMPLETED_EVENT = "WORKOUT_COMPLETED_EVENT";

export const WorkoutCompletedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_COMPLETED_EVENT),
  payload: v.object({ workoutId: VO.WorkoutId, requesterId: Auth.VO.UserId }),
});

export type WorkoutCompletedEventType = v.InferOutput<typeof WorkoutCompletedEvent>;
