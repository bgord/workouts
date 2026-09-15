import * as bg from "@bgord/ui";
import { Check, Copy } from "lucide-react";
import type { Workout } from "../../modules/workouts/value-objects/workout";
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

export function WorkoutCopy(props: Workout & { completedAt: NonNullable<Workout["completedAt"]> }) {
  const t = bg.useTranslations();
  const copied = bg.useToggle({ name: `workout-copy-${props.id}` });

  return (
    <button
      aria-label={t("workout.copy.cta")}
      className="c-button"
      data-color={copied.on ? "brand-300" : "neutral-400"}
      data-hover-color="brand-300"
      data-variant="ghost"
      onClick={() =>
        bg.Clipboard.copy({
          text: WorkoutReport.create(props),
          onSuccess: () => {
            copied.enable();
            setTimeout(copied.disable, 2000);
          },
        })
      }
      title={copied.on ? t("workout.copy.done") : t("workout.copy.title")}
      type="button"
    >
      {copied.on ? <Check data-size="sm" /> : <Copy data-size="sm" />}
    </button>
  );
}
