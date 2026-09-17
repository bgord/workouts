import * as bg from "@bgord/ui";
import { Check, Copy } from "lucide-react";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { workoutRoute } from "../router";
import { WeightFormat } from "../services/weight-format";

const WorkoutReport = {
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

export function WorkoutCopy() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const workoutCopy = bg.useToggle({ name: `workout-copy-${workout.data.id}` });

  const completedAt = workout.data.completedAt;

  if (!completedAt) return null;

  return (
    <button
      aria-label={t("workout.copy.cta")}
      className="c-button"
      data-color={workoutCopy.on ? "brand-300" : "neutral-400"}
      data-hover-color="brand-300"
      data-variant="ghost"
      onClick={() =>
        bg.Clipboard.copy({
          text: WorkoutReport.create({ ...workout.data, completedAt }),
          onSuccess: () => {
            workoutCopy.enable();
            setTimeout(workoutCopy.disable, 2000);
          },
        })
      }
      title={workoutCopy.on ? t("workout.copy.done") : t("workout.copy.title")}
      type="button"
    >
      {workoutCopy.on ? <Check data-size="sm" /> : <Copy data-size="sm" />}
    </button>
  );
}
