import type { WorkoutGetResponse } from "../../modules/workouts/queries/get-workout";
import { ResistanceFormat } from "../kits/resistance.format";
import { DateFormat } from "./date-format";

export class WorkoutReport {
  static create(
    workout: WorkoutGetResponse["data"] & {
      completedAt: NonNullable<WorkoutGetResponse["data"]["completedAt"]>;
    },
  ) {
    const rows = workout.exercises.flatMap((exercise) =>
      exercise.loggedSets.map(
        (loggedSet) =>
          `| ${exercise.exerciseName} | ${loggedSet.setNumber} | ${loggedSet.reps} | ${ResistanceFormat[exercise.resistance].report(loggedSet.load)} | ${loggedSet.rir ?? "not recorded"} |`,
      ),
    );

    return [
      `# Workout: ${workout.planName} - ${workout.planSectionName}`,
      "",
      `Completed at: ${DateFormat.instant(workout.completedAt)}`,
      `Workout id: ${workout.id}`,
      `Logged sets: ${rows.length}`,
      "",
      "| exercise | set number | reps | load (kg) | reps in reserve |",
      "| --- | --- | --- | --- | --- |",
      ...rows,
    ].join("\n");
  }
}
