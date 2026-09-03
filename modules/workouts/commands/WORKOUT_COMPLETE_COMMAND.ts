import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_COMPLETE_COMMAND = "WORKOUT_COMPLETE_COMMAND";

export const WorkoutCompleteCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_COMPLETE_COMMAND),
  payload: v.object({ workoutId: WorkoutId, requesterId: Auth.VO.UserId }),
});

export type WorkoutCompleteCommandType = v.InferOutput<typeof WorkoutCompleteCommand>;
