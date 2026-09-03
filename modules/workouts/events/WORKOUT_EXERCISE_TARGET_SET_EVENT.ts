import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_EXERCISE_TARGET_SET_EVENT = "WORKOUT_EXERCISE_TARGET_SET_EVENT";

export const WorkoutExerciseTargetSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_EXERCISE_TARGET_SET_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    workoutExerciseId: VO.WorkoutExerciseId,
    target: VO.ExerciseTarget,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutExerciseTargetSetEventType = v.InferOutput<typeof WorkoutExerciseTargetSetEvent>;
