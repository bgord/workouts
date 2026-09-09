import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import * as VO from "+workouts/value-objects";

export const WORKOUT_SET_CORRECTED_EVENT = "WORKOUT_SET_CORRECTED_EVENT";

export const WorkoutSetCorrectedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_SET_CORRECTED_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    workoutExerciseId: VO.WorkoutExerciseId,
    exerciseId: Exercises.VO.ExerciseId,
    loggedSet: VO.LoggedSet,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutSetCorrectedEventType = v.InferOutput<typeof WorkoutSetCorrectedEvent>;
