import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronRight, EqualApproximately, Sigma, Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { DeltaKg } from "../components/delta-kg";
import { RepsLoad } from "../components/reps-load";
import { RirBadge } from "../components/rir-badge";
import { DateFormat } from "../services/date-format";
import { WeightFormat } from "../services/weight-format";

export function ExerciseHistory(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();
  const language = useLanguage();

  const performances = props.performances.toReversed();
  const record = props.performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];

  return (
    <ul data-gap="5" data-stack="y">
      {performances.map((performance, index) => (
        <li className="c-card" key={performance.workoutId}>
          <div className="c-card-header">
            <Link
              className="c-card-title"
              data-cross="center"
              data-gap="2"
              data-hover-color="brand-300"
              data-stack="x"
              params={{ workoutId: performance.workoutId }}
              search={WorkoutHistoryFilters.default}
              to="/workouts/$workoutId"
            >
              {DateFormat.dayWithTime(language, DateFormat.zoned(performance.performedAt))}

              <ChevronRight data-size="sm" />

              {performance.workoutId === record?.workoutId && (
                <Trophy
                  aria-label={t("statistics.exercise.one_rep_max_estimate")}
                  data-color="brand-300"
                  data-ml="auto"
                  data-size="xs"
                />
              )}
            </Link>
          </div>

          <ul data-stack="y">
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

                <div data-color="neutral-100" data-fs="sm" data-fw="medium">
                  <RepsLoad load={set.load} reps={set.reps} />
                </div>

                <div data-grow="1">{set.rir !== undefined && <RirBadge rir={set.rir} />}</div>

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
                  load: WeightFormat.kilograms(performance.volume),
                })}
              </span>

              <DeltaKg current={performance.volume} previous={performances[index + 1]?.volume} />
            </div>

            <div className="c-badge" data-gap="1-5" data-px="2-5" data-py="1" data-variant="outline">
              <EqualApproximately data-color="neutral-500" data-size="xs" />

              <span data-color="neutral-100" data-fw="bold">
                {t("statistics.exercise.one_rep_max_estimate.value", {
                  load: WeightFormat.kilograms(performance.bestEstimate),
                })}
              </span>

              <DeltaKg current={performance.bestEstimate} previous={performances[index + 1]?.bestEstimate} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
