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
    <ul data-gap="3" data-stack="y">
      {performances.map((performance, index) => (
        <li className="c-card" data-gap="3" data-md-p="2-5" data-p="4" key={performance.workoutId}>
          <div data-cross="center" data-gap="2" data-stack="x">
            <Link
              data-color="neutral-300"
              data-cross="center"
              data-fs="sm"
              data-fw="medium"
              data-gap="1"
              data-grow="1"
              data-hover-color="brand-300"
              data-stack="x"
              params={{ workoutId: performance.workoutId }}
              search={WorkoutHistoryFilters.default}
              to="/workouts/$workoutId"
            >
              {DateFormat.dayWithTime(language, DateFormat.zoned(performance.performedAt))}

              <ChevronRight data-color="neutral-500" data-size="sm" />
            </Link>

            {performance.workoutId === record?.workoutId && (
              <Trophy
                aria-label={t("statistics.exercise.one_rep_max_estimate")}
                data-color="brand-400"
                data-size="xs"
              />
            )}
          </div>

          <ul data-stack="y">
            {performance.sets.map((set, position) => (
              <li
                data-bct="alpha-subtle"
                data-bst={position > 0 ? "solid" : "none"}
                data-bwt="hairline"
                data-cross="center"
                data-gap="3"
                data-py="1-5"
                data-stack="x"
                key={set.setNumber}
              >
                <div data-color="neutral-600" data-fs="xs" data-transform="font-variant-numeric">
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

          <div
            data-bct="alpha-subtle"
            data-bst="solid"
            data-bwt="hairline"
            data-cross="center"
            data-gap="5"
            data-pt="3"
            data-stack="x"
          >
            <div data-cross="center" data-gap="1-5" data-stack="x">
              <EqualApproximately data-color="neutral-600" data-size="xs" />

              <span data-color="neutral-300" data-fs="sm" data-fw="medium">
                {t("statistics.exercise.one_rep_max_estimate.value", {
                  load: WeightFormat.kilograms(performance.bestEstimate),
                })}
              </span>

              <span data-fs="xs">
                <DeltaKg
                  current={performance.bestEstimate}
                  previous={performances[index + 1]?.bestEstimate}
                />
              </span>
            </div>

            <div data-cross="center" data-gap="1-5" data-stack="x">
              <Sigma data-color="neutral-600" data-size="xs" />

              <span data-color="neutral-300" data-fs="sm" data-fw="medium">
                {t("statistics.exercise.history.volume_load.value", {
                  load: WeightFormat.kilograms(performance.volume),
                })}
              </span>

              <span data-fs="xs">
                <DeltaKg current={performance.volume} previous={performances[index + 1]?.volume} />
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
