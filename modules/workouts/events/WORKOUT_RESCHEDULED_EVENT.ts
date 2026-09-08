import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_RESCHEDULED_EVENT = "WORKOUT_RESCHEDULED_EVENT";

export const WorkoutRescheduledEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_RESCHEDULED_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    scheduledFor: VO.WorkoutScheduledFor,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutRescheduledEventType = v.InferOutput<typeof WorkoutRescheduledEvent>;
