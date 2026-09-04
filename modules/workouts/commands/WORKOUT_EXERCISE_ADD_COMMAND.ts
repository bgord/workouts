import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import { ExercisePrescription } from "../value-objects/exercise-prescription";
import { WorkoutExerciseId } from "../value-objects/workout-exercise-id";
import { WorkoutId } from "../value-objects/workout-id";

// Stryker disable next-line StringLiteral
export const WORKOUT_EXERCISE_ADD_COMMAND = "WORKOUT_EXERCISE_ADD_COMMAND";

export const WorkoutExerciseAddCommand = v.object({
  ...bg.CommandEnvelopeSchema,
  revision: v.instance(tools.Revision),
  name: v.literal(WORKOUT_EXERCISE_ADD_COMMAND),
  payload: v.object({
    workoutId: WorkoutId,
    workoutExerciseId: WorkoutExerciseId,
    exerciseId: Exercises.VO.ExerciseId,
    prescription: ExercisePrescription,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutExerciseAddCommandType = v.InferOutput<typeof WorkoutExerciseAddCommand>;
