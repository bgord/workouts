import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import * as VO from "+workouts/value-objects";

export const WORKOUT_EXERCISE_ADDED_EVENT = "WORKOUT_EXERCISE_ADDED_EVENT";

export const WorkoutExerciseAddedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_EXERCISE_ADDED_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    workoutExerciseId: VO.WorkoutExerciseId,
    exerciseId: Exercises.VO.ExerciseId,
    exerciseName: Exercises.VO.ExerciseName,
    exerciseImageEtag: bg.HashValue,
    exerciseDescription: Exercises.VO.ExerciseDescription,
    prescription: VO.ExercisePrescription,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutExerciseAddedEventType = v.InferOutput<typeof WorkoutExerciseAddedEvent>;
