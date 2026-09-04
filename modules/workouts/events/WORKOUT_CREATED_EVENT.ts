import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Plans from "+plans";
import * as VO from "+workouts/value-objects";

export const WORKOUT_CREATED_EVENT = "WORKOUT_CREATED_EVENT";

export const WorkoutCreatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_CREATED_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    planId: Plans.VO.PlanId,
    planName: Plans.VO.PlanName,
    planSectionId: Plans.VO.PlanSectionId,
    planSectionName: Plans.VO.PlanSectionName,
    scheduledFor: VO.WorkoutScheduledFor,
    userId: Auth.VO.UserId,
  }),
});

export type WorkoutCreatedEventType = v.InferOutput<typeof WorkoutCreatedEvent>;
