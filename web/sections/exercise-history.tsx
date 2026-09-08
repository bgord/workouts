import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, TrendingUp, Trophy } from "lucide-react";
import { useState } from "react";
import { DateFormat } from "../../app/services/date-format";
import type {
  ExerciseHistory as ExerciseHistoryType,
  ExerciseSession,
} from "../../modules/stats/value-objects/exercise-history";
import { ExerciseHistoryChart } from "../components/exercise-history-chart";

const GRAMS_IN_KILOGRAM = 1000;
const DECIMAL = 10;

const kilograms = (grams: number) => Math.round((grams / GRAMS_IN_KILOGRAM) * DECIMAL) / DECIMAL;

function Delta(props: { value?: number }) {
  if (props.value === undefined || props.value === 0) return null;

  const Icon = props.value > 0 ? ArrowUp : ArrowDown;

  return (
    <span
      data-color={props.value > 0 ? "positive-400" : "danger-400"}
      data-cross="center"
      data-gap="1"
      data-stack="x"
    >
      <Icon data-size="xs" />

      {kilograms(Math.abs(props.value))}
    </span>
  );
}

export function ExerciseHistory(props: { history: ExerciseHistoryType }) {
  const t = useTranslations();
  const language = useLanguage();

  const [selected, setSelected] = useState<ExerciseSession["workoutId"]>();

  const chronological = props.history.sessions.toReversed();

  return (
    <div data-gap="8" data-pt="5" data-stack="y">
      {props.history.sessions.length === 0 && (
        <div data-color="neutral-400" data-fs="sm">
          {t("exercise.history.empty")}
        </div>
      )}

      {(props.history.record || props.history.estimatedRecord) && (
        <div data-cross="center" data-gap="3" data-mr="auto" data-stack="x">
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

          {props.history.estimatedRecord && (
            <div className="c-card" data-cross="center" data-gap="5" data-stack="x">
              <TrendingUp data-color="neutral-300" data-size="sm" />

              <div data-color="neutral-100" data-fs="base" data-fw="medium" data-lh="none">
                {t("exercise.history.one_rep_max_estimate", {
                  load: kilograms(props.history.estimatedRecord.oneRepMaxEstimate),
                })}
              </div>

              <div data-color="neutral-400" data-fs="sm" data-transform="nowrap">
                {DateFormat.dayWithWeekday(
                  language,
                  DateFormat.zoned(props.history.estimatedRecord.completedAt).toPlainDate(),
                )}
              </div>
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

              {props.history.record?.workoutId === session.workoutId && (
                <Trophy data-color="brand-300" data-size="sm" />
              )}

              {props.history.estimatedRecord?.workoutId === session.workoutId && (
                <TrendingUp data-color="neutral-300" data-size="sm" />
              )}

              <div data-color="neutral-400" data-fs="sm" data-ml="auto" data-transform="nowrap">
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

            <div className="c-card-footer">
              {session.oneRepMaxEstimate !== undefined && (
                <div className="c-badge" data-variant="outline">
                  {t("exercise.history.one_rep_max_estimate", {
                    load: kilograms(session.oneRepMaxEstimate),
                  })}

                  <Delta value={session.oneRepMaxEstimateDelta} />
                </div>
              )}

              <div className="c-badge" data-ml="auto" data-variant="outline">
                {t("exercise.history.volume", { load: kilograms(session.volume) })}

                <Delta value={session.volumeDelta} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
