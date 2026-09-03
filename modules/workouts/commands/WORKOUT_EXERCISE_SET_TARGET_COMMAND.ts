import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import { ExerciseTarget } from "../value-objects/exercise-target";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_EXERCISE_SET_TARGET_COMMAND = "WORKOUT_EXERCISE_SET_TARGET_COMMAND";

export const WorkoutExerciseSetTargetCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_EXERCISE_SET_TARGET_COMMAND),
  payload: v.object({
    workoutId: WorkoutId,
    workoutExerciseId: WorkoutExerciseId,
    target: ExerciseTarget,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutExerciseSetTargetCommandType = v.InferOutput<typeof WorkoutExerciseSetTargetCommand>;
