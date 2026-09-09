import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Medal } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExerciseSet } from "../api";

const GRAMS_IN_KILOGRAM = 1000;

export function ExerciseBestSet(props: { bestSet: ExerciseSet | null }) {
  const t = useTranslations();

  if (!props.bestSet) return null;

  return (
    <Link
      className="c-card"
      data-cross="center"
      data-gap="3"
      data-hover-color="brand-300"
      data-stack="x"
      params={{ workoutId: props.bestSet.workoutId }}
      search={WorkoutHistoryFilters.default}
      to="/workouts/$workoutId"
    >
      <Medal data-color="brand-500" data-size="lg" />

      <div data-gap="0" data-stack="y">
        <div data-color="neutral-400" data-fs="xs" data-fw="medium">
          {t("statistics.exercise.best_set")}
        </div>

        <div data-color="neutral-0" data-fs="xl" data-fw="bold">
          {t("statistics.exercise.best_set.value", {
            load: props.bestSet.load / GRAMS_IN_KILOGRAM,
            reps: props.bestSet.reps,
          })}
        </div>
      </div>
    </Link>
  );
}
