import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_DISCARD_COMMAND = "WORKOUT_DISCARD_COMMAND";

export const WorkoutDiscardCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_DISCARD_COMMAND),
  payload: v.object({ workoutId: WorkoutId, requesterId: Auth.VO.UserId }),
});

export type WorkoutDiscardCommandType = v.InferOutput<typeof WorkoutDiscardCommand>;
