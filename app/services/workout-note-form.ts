import { WorkoutNoteMax, WorkoutNoteMin } from "../../modules/workouts/value-objects/workout-note.validation";

export const Form = {
  note: { pattern: { min: WorkoutNoteMin, max: WorkoutNoteMax }, field: { name: "workoutNote" } },
};
