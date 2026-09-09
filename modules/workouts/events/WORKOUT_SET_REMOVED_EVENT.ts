import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_SET_REMOVED_EVENT = "WORKOUT_SET_REMOVED_EVENT";

export const WorkoutSetRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_SET_REMOVED_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    workoutExerciseId: VO.WorkoutExerciseId,
    loggedSetId: VO.LoggedSetId,
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutSetRemovedEventType = v.InferOutput<typeof WorkoutSetRemovedEvent>;
