import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { Load } from "../value-objects/load";
import { Reps } from "../value-objects/reps";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_SET_LOG_COMMAND = "WORKOUT_SET_LOG_COMMAND";

export const WorkoutSetLogCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_SET_LOG_COMMAND),
  payload: v.object({
    workoutId: WorkoutId,
    workoutExerciseId: WorkoutExerciseId,
    reps: Reps,
    load: Load,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutSetLogCommandType = v.InferOutput<typeof WorkoutSetLogCommand>;
