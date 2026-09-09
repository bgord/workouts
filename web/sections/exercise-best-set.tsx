import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Medal } from "lucide-react";
import { DateFormat } from "../../app/services/date-format";
import { WeightFormat } from "../../app/services/weight-format";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExerciseSet } from "../../modules/workouts/open-host-queries";

export function ExerciseBestSet(props: ExerciseSet) {
  const t = useTranslations();
  const language = useLanguage();

  return (
    <Link
      className="c-card"
      data-cross="center"
      data-gap="3"
      data-hover-bc="brand-500"
      data-stack="x"
      params={{ workoutId: props.workoutId }}
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
        <Medal data-color="brand-300" data-size="md" />
      </div>

      <div data-gap="0-5" data-stack="y">
        <div data-color="neutral-400" data-fs="xs" data-transform="uppercase">
          {t("statistics.exercise.best_set")}
        </div>

        <div data-color="neutral-0" data-fs="2xl" data-fw="bold" data-lh="tight">
          {t("statistics.exercise.best_set.value", {
            load: WeightFormat.kilograms(props.load),
            reps: props.reps,
          })}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {DateFormat.dayWithTime(language, DateFormat.zoned(props.createdAt))}
        </div>
      </div>
    </Link>
  );
}
