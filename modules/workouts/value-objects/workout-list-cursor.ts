import * as v from "valibot";
import { WorkoutId } from "./workout-id";
import { WorkoutScheduledFor } from "./workout-scheduled-for";

export const WorkoutListCursorError = { invalid: "workout.list.cursor.invalid" };

export const WorkoutListCursor = v.object(
  { scheduledFor: WorkoutScheduledFor, id: WorkoutId },
  WorkoutListCursorError.invalid,
);
export type WorkoutListCursorType = v.InferOutput<typeof WorkoutListCursor>;
