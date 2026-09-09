import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExerciseOneRepMax } from "../api";

const GRAMS_IN_KILOGRAM = 1000;

export function ExerciseOneRepMaxEstimate(props: { oneRepMax: ExerciseOneRepMax | null }) {
  const t = useTranslations();

  if (!props.oneRepMax) return null;

  return (
    <Link
      className="c-card"
      data-cross="center"
      data-gap="3"
      data-hover-color="brand-300"
      data-stack="x"
      params={{ workoutId: props.oneRepMax.set.workoutId }}
      search={WorkoutHistoryFilters.default}
      to="/workouts/$workoutId"
    >
      <Trophy data-color="brand-500" data-size="lg" />

      <div data-gap="0" data-stack="y">
        <div data-color="neutral-400" data-fs="xs" data-fw="medium">
          {t("statistics.exercise.one_rep_max_estimate")}
        </div>

        <div data-color="neutral-0" data-fs="xl" data-fw="bold">
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: props.oneRepMax.estimate / GRAMS_IN_KILOGRAM,
          })}
        </div>

        <div data-color="neutral-400" data-fs="xs">
          {t("statistics.exercise.one_rep_max_estimate.set", {
            load: props.oneRepMax.set.load / GRAMS_IN_KILOGRAM,
            reps: props.oneRepMax.set.reps,
          })}
        </div>
      </div>
    </Link>
  );
}
