import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Plans from "+plans";
import { WorkoutId } from "../value-objects/workout-id";
import { WorkoutScheduledFor } from "../value-objects/workout-scheduled-for";

// Stryker disable next-line StringLiteral
export const WORKOUT_CREATE_COMMAND = "WORKOUT_CREATE_COMMAND";

export const WorkoutCreateCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  name: v.literal(WORKOUT_CREATE_COMMAND),
  payload: v.object({
    workoutId: WorkoutId,
    planId: Plans.VO.PlanId,
    planSectionId: Plans.VO.PlanSectionId,
    scheduledFor: WorkoutScheduledFor,
    userId: Auth.VO.UserId,
  }),
});

export type WorkoutCreateCommandType = v.InferOutput<typeof WorkoutCreateCommand>;
