import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_EXERCISE_REMOVE_COMMAND = "WORKOUT_EXERCISE_REMOVE_COMMAND";

export const WorkoutExerciseRemoveCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_EXERCISE_REMOVE_COMMAND),
  payload: v.object({
    workoutId: WorkoutId,
    workoutExerciseId: WorkoutExerciseId,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutExerciseRemoveCommandType = v.InferOutput<typeof WorkoutExerciseRemoveCommand>;
