import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { WorkoutId } from "../value-objects/workout-id";
import { WorkoutScheduledFor } from "../value-objects/workout-scheduled-for";

// Stryker disable next-line StringLiteral
export const WORKOUT_RESCHEDULE_COMMAND = "WORKOUT_RESCHEDULE_COMMAND";

export const WorkoutRescheduleCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_RESCHEDULE_COMMAND),
  payload: v.object({
    workoutId: WorkoutId,
    scheduledFor: WorkoutScheduledFor,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutRescheduleCommandType = v.InferOutput<typeof WorkoutRescheduleCommand>;
