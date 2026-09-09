import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { WeightFormat } from "../services/weight-format";

export function ExerciseOneRepMaxEstimate(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();

  const best = props.performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];

  if (!best) return null;

  const set = best.sets.toSorted((a, b) => b.estimate - a.estimate)[0];

  if (!set) return null;

  return (
    <Link
      className="c-card"
      data-cross="center"
      data-gap="3"
      data-hover-bc="brand-500"
      data-stack="x"
      params={{ workoutId: best.workoutId }}
      search={WorkoutHistoryFilters.default}
      to="/workouts/$workoutId"
    >
      <div
        data-bg="alpha-soft"
        data-br="circle"
        data-cross="center"
        data-main="center"
        data-p="2-5"
        data-stack="x"
      >
        <Trophy data-color="brand-300" data-size="md" />
      </div>

      <div data-gap="0-5" data-stack="y">
        <div data-color="neutral-400" data-fs="xs" data-transform="uppercase">
          {t("statistics.exercise.one_rep_max_estimate")}
        </div>

        <div data-color="neutral-0" data-fs="2xl" data-fw="bold" data-lh="tight">
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: WeightFormat.kilograms(best.bestEstimate),
          })}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {t("statistics.exercise.one_rep_max_estimate.set", {
            load: WeightFormat.kilograms(set.load),
            reps: set.reps,
          })}
        </div>
      </div>
    </Link>
  );
}
