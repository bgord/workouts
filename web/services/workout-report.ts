import * as bg from "@bgord/ui";
import type { WorkoutGetResponse } from "../../modules/workouts/queries/get-workout";
import { LateralityFormat } from "../kits/laterality.format";
import { ResistanceFormat } from "../kits/resistance.format";

export class WorkoutReport {
  static create(
    workout: WorkoutGetResponse["data"] & {
      completedAt: NonNullable<WorkoutGetResponse["data"]["completedAt"]>;
    },
  ) {
    const rows = workout.exercises.flatMap((exercise) =>
      exercise.loggedSets.map(
        (loggedSet) =>
          `| ${exercise.exerciseName} | ${loggedSet.setNumber} | ${loggedSet.reps} | ${ResistanceFormat[exercise.resistance].report(loggedSet.load)} | ${LateralityFormat[exercise.laterality].report()} | ${loggedSet.rir ?? "not recorded"} |`,
      ),
    );

    return [
      `# Workout: ${workout.planName} - ${workout.planSectionName}`,
      "",
      `Completed at: ${bg.Clock.iso(workout.completedAt)}`,
      `Workout id: ${workout.id}`,
      `Logged sets: ${rows.length}`,
      "",
      "| exercise | set number | reps | load (kg) | sides | reps in reserve |",
      "| --- | --- | --- | --- | --- | --- |",
      ...rows,
    ].join("\n");
  }
}
