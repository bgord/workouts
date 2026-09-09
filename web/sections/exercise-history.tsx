import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { DateFormat } from "../../app/services/date-format";
import { WeightFormat } from "../../app/services/weight-format";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExerciseSet } from "../../modules/workouts/open-host-queries";

export function ExerciseHistory(props: { sets: Array<ExerciseSet> }) {
  const t = useTranslations();
  const language = useLanguage();

  const sessions = [...Map.groupBy(props.sets, (set) => set.workoutId)].toReversed();

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
              {sets[0] && DateFormat.dayWithTime(language, DateFormat.zoned(sets[0].createdAt))}

              <ChevronRight data-size="sm" />
            </Link>
          </div>

          <ul data-gap="0" data-stack="y">
            {sets.map((set, index) => (
              <li
                data-bct={index > 0 ? "alpha-subtle" : undefined}
                data-bst={index > 0 ? "solid" : undefined}
                data-bwt={index > 0 ? "hairline" : undefined}
                data-cross="center"
                data-gap="3"
                data-py="2"
                data-stack="x"
                key={set.id}
              >
                <div className="c-badge" data-variant="outline">
                  {index + 1}
                </div>

                <div data-color="neutral-100" data-fs="sm" data-fw="medium" data-grow="1">
                  {t("workout.exercise.logged_set", {
                    load: WeightFormat.kilograms(set.load),
                    reps: set.reps,
                  })}
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
