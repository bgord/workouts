import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_EXERCISE_MOVED_EVENT = "WORKOUT_EXERCISE_MOVED_EVENT";

export const WorkoutExerciseMovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_EXERCISE_MOVED_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    workoutExerciseId: VO.WorkoutExerciseId,
    position: VO.WorkoutExercisePosition,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutExerciseMovedEventType = v.InferOutput<typeof WorkoutExerciseMovedEvent>;
