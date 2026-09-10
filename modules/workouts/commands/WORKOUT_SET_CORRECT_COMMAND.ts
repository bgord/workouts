import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { Load } from "../value-objects/load";
import { LoggedSetId } from "../value-objects/logged-set-id";
import { Reps } from "../value-objects/reps";
import { Rir } from "../value-objects/rir";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_SET_CORRECT_COMMAND = "WORKOUT_SET_CORRECT_COMMAND";

export const WorkoutSetCorrectCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_SET_CORRECT_COMMAND),
  payload: v.object({
    workoutId: WorkoutId,
    workoutExerciseId: WorkoutExerciseId,
    loggedSetId: LoggedSetId,
    reps: Reps,
    load: Load,
    rir: v.optional(Rir),
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutSetCorrectCommandType = v.InferOutput<typeof WorkoutSetCorrectCommand>;
