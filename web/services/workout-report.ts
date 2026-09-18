import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WeightFormat } from "./weight-format";

export const WorkoutReport = {
  create: (workout: Workout & { completedAt: NonNullable<Workout["completedAt"]> }) => {
    const rows = workout.exercises.flatMap((exercise) =>
      exercise.loggedSets.map(
        (loggedSet) =>
          `| ${exercise.exerciseName} | ${loggedSet.setNumber} | ${loggedSet.reps} | ${WeightFormat.kilograms(loggedSet.load)} | ${loggedSet.rir ?? "not recorded"} |`,
      ),
    );

    return [
      `# Workout: ${workout.planName} - ${workout.planSectionName}`,
      "",
      `Completed at: ${Temporal.Instant.fromEpochMilliseconds(workout.completedAt).toString()}`,
      `Workout id: ${workout.id}`,
      `Logged sets: ${rows.length}`,
      "",
      "| exercise | set number | reps | load (kg) | reps in reserve |",
      "| --- | --- | --- | --- | --- |",
      ...rows,
    ].join("\n");
  },
};
