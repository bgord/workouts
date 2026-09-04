import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_EXERCISE_REMOVED_EVENT = "WORKOUT_EXERCISE_REMOVED_EVENT";

export const WorkoutExerciseRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_EXERCISE_REMOVED_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    workoutExerciseId: VO.WorkoutExerciseId,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutExerciseRemovedEventType = v.InferOutput<typeof WorkoutExerciseRemovedEvent>;
