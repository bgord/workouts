import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_ABANDON_COMMAND = "WORKOUT_ABANDON_COMMAND";

export const WorkoutAbandonCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_ABANDON_COMMAND),
  payload: v.object({ workoutId: WorkoutId, requesterId: Auth.VO.UserId }),
});

export type WorkoutAbandonCommandType = v.InferOutput<typeof WorkoutAbandonCommand>;
