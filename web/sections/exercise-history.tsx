import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { DateFormat } from "../../app/services/date-format";
import type { ExerciseSession } from "../../modules/stats/value-objects/exercise-history";
import { ExerciseHistoryChart } from "../components/exercise-history-chart";

const GRAMS_IN_KILOGRAM = 1000;

export function ExerciseHistory(props: { history: ReadonlyArray<ExerciseSession> }) {
  const t = useTranslations();
  const language = useLanguage();

  const [selected, setSelected] = useState<ExerciseSession["workoutId"]>();

  const chronological = props.history.toReversed();

  return (
    <div
      data-bct="alpha-subtle"
      data-bst="solid"
      data-bwt="hairline"
      data-gap="8"
      data-mt="5"
      data-pt="5"
      data-stack="y"
    >
      {props.history.length === 0 && (
        <div data-color="neutral-400" data-fs="sm">
          {t("exercise.history.empty")}
        </div>
      )}

      {chronological.length > 1 && (
        <ExerciseHistoryChart onSelect={setSelected} selected={selected} sessions={chronological} />
      )}

      <ul data-gap="3" data-stack="y">
        {props.history.map((session) => {
          const completedAt = DateFormat.zoned(session.completedAt);

          return (
            <li
              className="c-card"
              data-bc={selected === session.workoutId ? "brand-500" : undefined}
              key={session.workoutId}
            >
              <div data-cross="baseline" data-gap="2" data-main="between" data-stack="x">
                <Link
                  className="c-card-title"
                  data-hover-color="brand-300"
                  data-transform="truncate"
                  params={{ workoutId: session.workoutId }}
                  search={{ section: undefined }}
                  to="/workouts/$workoutId"
                >
                  {DateFormat.dayWithWeekday(language, completedAt.toPlainDate())}
                </Link>

                <div data-color="neutral-400" data-fs="sm" data-transform="nowrap">
                  {DateFormat.time(language, completedAt)}
                </div>
              </div>

              <ul data-bct="alpha-subtle" data-bst="solid" data-bwt="hairline" data-gap="0" data-stack="y">
                {session.sets.map((set, index) => (
                  <li
                    data-bct={index > 0 ? "alpha-subtle" : undefined}
                    data-bst={index > 0 ? "solid" : undefined}
                    data-bwt={index > 0 ? "hairline" : undefined}
                    data-cross="center"
                    data-gap="3"
                    data-py="2"
                    data-stack="x"
                    key={`${session.workoutId}-${index}`}
                  >
                    <div className="c-badge" data-variant="outline">
                      {index + 1}
                    </div>

                    <div data-color="neutral-100" data-fs="sm" data-fw="medium">
                      {t("workout.exercise.logged_set", {
                        reps: set.reps,
                        load: set.load / GRAMS_IN_KILOGRAM,
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
