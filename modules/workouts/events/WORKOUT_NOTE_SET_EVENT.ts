import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+workouts/value-objects";

export const WORKOUT_NOTE_SET_EVENT = "WORKOUT_NOTE_SET_EVENT";

export const WorkoutNoteSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WORKOUT_NOTE_SET_EVENT),
  payload: v.object({
    workoutId: VO.WorkoutId,
    note: v.optional(VO.WorkoutNote),
    requesterId: Auth.VO.UserId,
  }),
});

export type WorkoutNoteSetEventType = v.InferOutput<typeof WorkoutNoteSetEvent>;
