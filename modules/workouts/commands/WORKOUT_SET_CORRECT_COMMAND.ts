import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { Load } from "../value-objects/load";
import { Reps } from "../value-objects/reps";
import { SetNumber } from "../value-objects/set-number";
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
    setNumber: SetNumber,
    reps: Reps,
    load: Load,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutSetCorrectCommandType = v.InferOutput<typeof WorkoutSetCorrectCommand>;
