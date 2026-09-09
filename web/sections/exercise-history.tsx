import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronRight, EqualApproximately, Sigma } from "lucide-react";
import { DateFormat } from "../../app/services/date-format";
import { WeightFormat } from "../../app/services/weight-format";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExerciseSetOneRepMaxEstimate } from "../../modules/statistics/value-objects/exercise-set-one-rep-max-estimate";

export function ExerciseHistory(props: { sets: Array<ExerciseSetOneRepMaxEstimate> }) {
  const t = useTranslations();
  const language = useLanguage();

  const sessions = [...Map.groupBy(props.sets, (entry) => entry.set.workoutId)].toReversed();

  return (
    <ul data-gap="3" data-stack="y">
      {sessions.map(([workoutId, sets]) => (
        <li className="c-card" key={workoutId}>
          <div className="c-card-header">
            <Link
              className="c-card-title"
              data-cross="center"
              data-gap="1"
              data-hover-color="brand-300"
              data-stack="x"
              params={{ workoutId }}
              search={WorkoutHistoryFilters.default}
              to="/workouts/$workoutId"
            >
              {sets[0] && DateFormat.dayWithTime(language, DateFormat.zoned(sets[0].set.createdAt))}

              <ChevronRight data-size="sm" />
            </Link>
          </div>

          <ul data-gap="0" data-stack="y">
            {sets.map((entry, index) => (
              <li
                data-bct={index > 0 ? "alpha-subtle" : undefined}
                data-bst={index > 0 ? "solid" : undefined}
                data-bwt={index > 0 ? "hairline" : undefined}
                data-cross="center"
                data-gap="3"
                data-py="2"
                data-stack="x"
                key={entry.set.id}
              >
                <div className="c-badge" data-variant="outline">
                  {index + 1}
                </div>

                <div data-color="neutral-100" data-fs="sm" data-fw="medium" data-grow="1">
                  {t("workout.exercise.logged_set", {
                    load: WeightFormat.kilograms(entry.set.load),
                    reps: entry.set.reps,
                  })}
                </div>

                <div data-color="neutral-500" data-fs="xs">
                  {t("statistics.exercise.one_rep_max_estimate.value", {
                    load: WeightFormat.kilograms(entry.estimate),
                  })}
                </div>
              </li>
            ))}
          </ul>

          <div data-main="between" data-stack="x">
            <div className="c-badge" data-px="2-5" data-variant="outline">
              <Sigma data-color="neutral-500" data-size="xs" />

              {t("statistics.exercise.history.volume_load.value", {
                load: WeightFormat.kilograms(
                  sets.reduce((total, entry) => total + entry.set.reps * entry.set.load, 0),
                ),
              })}
            </div>

            <div className="c-badge" data-px="2-5" data-variant="outline">
              <EqualApproximately data-color="neutral-500" data-size="xs" />

              {t("statistics.exercise.one_rep_max_estimate.value", {
                load: WeightFormat.kilograms(Math.max(...sets.map((entry) => entry.estimate))),
              })}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
