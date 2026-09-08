import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { History, Trophy } from "lucide-react";
import { useState } from "react";
import { DateFormat } from "../../app/services/date-format";
import type {
  ExerciseHistory as ExerciseHistoryType,
  ExerciseSession,
} from "../../modules/stats/value-objects/exercise-history";
import { ExerciseHistoryChart } from "../components/exercise-history-chart";

const GRAMS_IN_KILOGRAM = 1000;

export function ExerciseHistory(props: { history: ExerciseHistoryType }) {
  const t = useTranslations();
  const language = useLanguage();

  const [selected, setSelected] = useState<ExerciseSession["workoutId"]>();

  const chronological = props.history.sessions.toReversed();

  const days = props.history.daysSinceLastSession;

  let lastDone: string | undefined;

  if (days === 0) lastDone = t("exercise.history.last_done.today");
  if (days === 1) lastDone = t("exercise.history.last_done.yesterday");
  if (days !== undefined && days > 1) lastDone = t("exercise.history.last_done.many", { days });

  return (
    <div data-gap="8" data-pt="5" data-stack="y">
      {props.history.sessions.length === 0 && (
        <div data-color="neutral-400" data-fs="sm">
          {t("exercise.history.empty")}
        </div>
      )}

      {(props.history.record || lastDone) && (
        <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
          {props.history.record && (
            <div className="c-card" data-cross="center" data-gap="5" data-stack="x">
              <Trophy data-color="brand-300" data-size="sm" />

              <div data-color="neutral-0" data-fs="lg" data-fw="bold" data-lh="none">
                {t("workout.exercise.logged_set", {
                  reps: props.history.record.reps,
                  load: props.history.record.load / GRAMS_IN_KILOGRAM,
                })}
              </div>

              <div data-color="neutral-400" data-fs="sm" data-transform="nowrap">
                {DateFormat.dayWithWeekday(
                  language,
                  DateFormat.zoned(props.history.record.completedAt).toPlainDate(),
                )}
              </div>
            </div>
          )}

          {lastDone && (
            <div
              data-color="neutral-400"
              data-cross="center"
              data-fs="sm"
              data-gap="2"
              data-ml="auto"
              data-stack="x"
              data-transform="nowrap"
            >
              <History data-size="sm" />

              {lastDone}
            </div>
          )}
        </div>
      )}

      {chronological.length > 1 && (
        <ExerciseHistoryChart
          onSelect={setSelected}
          record={props.history.record}
          selected={selected}
          sessions={chronological}
        />
      )}

      <ul data-gap="3" data-stack="y">
        {props.history.sessions.map((session) => (
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
                {DateFormat.dayWithWeekday(language, DateFormat.zoned(session.completedAt).toPlainDate())}
              </Link>

              <div data-color="neutral-400" data-fs="sm" data-transform="nowrap">
                {DateFormat.time(language, DateFormat.zoned(session.completedAt))}
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
        ))}
      </ul>
    </div>
  );
}
