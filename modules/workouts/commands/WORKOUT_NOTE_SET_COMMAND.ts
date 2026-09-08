import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { WorkoutId } from "../value-objects/workout-id";
import { WorkoutNote } from "../value-objects/workout-note";

// Stryker disable next-line StringLiteral
export const WORKOUT_NOTE_SET_COMMAND = "WORKOUT_NOTE_SET_COMMAND";

export const WorkoutNoteSetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_NOTE_SET_COMMAND),
  payload: v.object({ workoutId: WorkoutId, note: v.optional(WorkoutNote), requesterId: Auth.VO.UserId }),
});

export type WorkoutNoteSetCommandType = v.InferOutput<typeof WorkoutNoteSetCommand>;
