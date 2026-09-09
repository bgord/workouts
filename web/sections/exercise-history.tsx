import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronRight, EqualApproximately, Sigma } from "lucide-react";
import { DateFormat } from "../../app/services/date-format";
import { WeightFormat } from "../../app/services/weight-format";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { DeltaKg } from "../components/delta-kg";

export function ExerciseHistory(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();
  const language = useLanguage();

  const performances = props.performances.toReversed();

  return (
    <ul data-gap="3" data-stack="y">
      {performances.map((performance, index) => {
        const previous = performances[index + 1];

        return (
          <li className="c-card" key={performance.workoutId}>
            <div className="c-card-header">
              <Link
                className="c-card-title"
                data-cross="center"
                data-gap="1"
                data-hover-color="brand-300"
                data-stack="x"
                params={{ workoutId: performance.workoutId }}
                search={WorkoutHistoryFilters.default}
                to="/workouts/$workoutId"
              >
                {DateFormat.dayWithTime(language, DateFormat.zoned(performance.performedAt))}

                <ChevronRight data-size="sm" />
              </Link>
            </div>

            <ul data-gap="0" data-stack="y">
              {performance.sets.map((set, index) => (
                <li
                  data-bct={index > 0 ? "alpha-subtle" : undefined}
                  data-bst={index > 0 ? "solid" : undefined}
                  data-bwt={index > 0 ? "hairline" : undefined}
                  data-cross="center"
                  data-gap="3"
                  data-py="2"
                  data-stack="x"
                  key={set.setNumber}
                >
                  <div className="c-badge" data-variant="outline">
                    {set.setNumber}
                  </div>

                  <div data-color="neutral-100" data-fs="sm" data-fw="medium" data-grow="1">
                    {t("workout.exercise.logged_set", {
                      load: WeightFormat.kilograms(set.load),
                      reps: set.reps,
                    })}
                  </div>

                  <div data-color="neutral-500" data-fs="xs">
                    {t("statistics.exercise.one_rep_max_estimate.value", {
                      load: WeightFormat.kilograms(set.estimate),
                    })}
                  </div>
                </li>
              ))}
            </ul>

            <div data-cross="center" data-gap="2" data-main="between" data-mt="1" data-stack="x">
              <div className="c-badge" data-gap="1-5" data-px="2-5" data-py="1" data-variant="outline">
                <Sigma data-color="neutral-500" data-size="xs" />

                <span data-color="neutral-100" data-fw="bold">
                  {t("statistics.exercise.history.volume_load.value", {
                    load: WeightFormat.kilograms(performance.load),
                  })}
                </span>

                <DeltaKg current={performance.load} previous={previous?.load} />
              </div>

              <div className="c-badge" data-gap="1-5" data-px="2-5" data-py="1" data-variant="outline">
                <EqualApproximately data-color="neutral-500" data-size="xs" />

                <span data-color="neutral-100" data-fw="bold">
                  {t("statistics.exercise.one_rep_max_estimate.value", {
                    load: WeightFormat.kilograms(performance.bestEstimate),
                  })}
                </span>

                <DeltaKg current={performance.bestEstimate} previous={previous?.bestEstimate} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
