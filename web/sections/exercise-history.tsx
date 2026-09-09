import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronRight, EqualApproximately, Sigma } from "lucide-react";
import { DateFormat } from "../../app/services/date-format";
import { WeightFormat } from "../../app/services/weight-format";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExerciseSetOneRepMaxEstimate } from "../../modules/statistics/value-objects/exercise-set-one-rep-max-estimate";
import { DeltaKg } from "../components/delta-kg";

const volumeLoad = (sets: Array<ExerciseSetOneRepMaxEstimate>) =>
  sets.reduce((total, entry) => total + entry.set.reps * entry.set.load, 0);

const oneRepMaxEstimate = (sets: Array<ExerciseSetOneRepMaxEstimate>) =>
  Math.max(...sets.map((entry) => entry.estimate));

export function ExerciseHistory(props: { sets: Array<ExerciseSetOneRepMaxEstimate> }) {
  const t = useTranslations();
  const language = useLanguage();

  const sessions = [...Map.groupBy(props.sets, (entry) => entry.set.workoutId)].toReversed();

  return (
    <ul data-gap="3" data-stack="y">
      {sessions.map(([workoutId, sets], index) => {
        const previous = sessions[index + 1]?.[1];

        return (
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

            <div data-cross="center" data-gap="2" data-main="between" data-mt="1" data-stack="x">
              <div className="c-badge" data-gap="1-5" data-px="2-5" data-py="1" data-variant="outline">
                <Sigma data-color="neutral-500" data-size="xs" />

                <span data-color="neutral-100" data-fw="bold">
                  {t("statistics.exercise.history.volume_load.value", {
                    load: WeightFormat.kilograms(volumeLoad(sets)),
                  })}
                </span>

                <DeltaKg current={volumeLoad(sets)} previous={previous && volumeLoad(previous)} />
              </div>

              <div className="c-badge" data-gap="1-5" data-px="2-5" data-py="1" data-variant="outline">
                <EqualApproximately data-color="neutral-500" data-size="xs" />

                <span data-color="neutral-100" data-fw="bold">
                  {t("statistics.exercise.one_rep_max_estimate.value", {
                    load: WeightFormat.kilograms(oneRepMaxEstimate(sets)),
                  })}
                </span>

                <DeltaKg
                  current={oneRepMaxEstimate(sets)}
                  previous={previous && oneRepMaxEstimate(previous)}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
