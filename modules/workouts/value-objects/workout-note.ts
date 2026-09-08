import * as v from "valibot";
import { WorkoutNoteMax, WorkoutNoteMin } from "./workout-note.validation";

export const WorkoutNoteError = { Type: "workout.note.type", Invalid: "workout.note.invalid" };

export const WorkoutNote = v.pipe(
  v.string(WorkoutNoteError.Type),
  v.minLength(WorkoutNoteMin, WorkoutNoteError.Invalid),
  v.maxLength(WorkoutNoteMax, WorkoutNoteError.Invalid),
  // Stryker disable next-line StringLiteral
  v.brand("WorkoutNote"),
);

export type WorkoutNoteType = v.InferOutput<typeof WorkoutNote>;
