import { Rhythm, useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, EqualApproximately, Sigma, Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { RepsLoad } from "../components/reps-load";
import { DateFormat } from "../services/date-format";
import { WeightFormat } from "../services/weight-format";

const TILE_MIN_WIDTH = 168;

export function ExerciseStats(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();
  const language = useLanguage();

  const best = props.performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];
  const heaviest = props.performances.toSorted((a, b) => b.volume - a.volume)[0];
  const latest = props.performances.at(-1);

  if (!(best && heaviest && latest)) return null;

  const set = best.sets.toSorted((a, b) => b.estimate - a.estimate)[0];

  return (
    <ul data-gap="3" data-stack="x" data-wrap="wrap">
      <li data-grow="1" data-md-width="100%" {...Rhythm(TILE_MIN_WIDTH).times(1).style.minWidth}>
        <Link
          className="c-card"
          data-cross="center"
          data-gap="1"
          data-height="100%"
          data-hover-bc="brand-500"
          data-p="4"
          data-stack="y"
          params={{ workoutId: best.workoutId }}
          search={WorkoutHistoryFilters.default}
          to="/workouts/$workoutId"
        >
          <div
            data-color="neutral-500"
            data-cross="center"
            data-fs="xs"
            data-gap="1-5"
            data-ls="wide"
            data-stack="x"
            data-transform="uppercase"
          >
            <Trophy data-color="brand-400" data-size="xs" />
            <div data-cross="center" data-stack="x">
              <EqualApproximately data-color="neutral-600" data-size="xs" />
              {t("statistics.exercise.one_rep_max_estimate")}
            </div>
          </div>

          <div data-color="neutral-0" data-fs="xl" data-fw="bold" data-lh="tight">
            {t("statistics.exercise.one_rep_max_estimate.value", {
              load: WeightFormat.kilograms(best.bestEstimate),
            })}
          </div>

          {set && (
            <div data-color="neutral-500" data-fs="xs">
              <RepsLoad load={set.load} reps={set.reps} />
            </div>
          )}
        </Link>
      </li>

      <li
        className="c-card"
        data-cross="center"
        data-gap="1"
        data-grow="1"
        data-md-width="100%"
        data-p="4"
        data-stack="y"
        {...Rhythm(TILE_MIN_WIDTH).times(1).style.minWidth}
      >
        <div
          data-color="neutral-500"
          data-cross="center"
          data-fs="xs"
          data-gap="1-5"
          data-ls="wide"
          data-stack="x"
          data-transform="uppercase"
        >
          <Sigma data-size="xs" />
          {t("statistics.exercise.volume")}
        </div>

        <div data-color="neutral-0" data-fs="xl" data-fw="bold" data-lh="tight">
          {t("statistics.exercise.history.volume_load.value", {
            load: WeightFormat.kilograms(heaviest.volume),
          })}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {DateFormat.day(language, DateFormat.zoned(heaviest.performedAt))}
        </div>
      </li>

      <li
        className="c-card"
        data-cross="center"
        data-gap="1"
        data-grow="1"
        data-md-width="100%"
        data-p="4"
        data-stack="y"
        {...Rhythm(TILE_MIN_WIDTH).times(1).style.minWidth}
      >
        <div
          data-color="neutral-500"
          data-cross="center"
          data-fs="xs"
          data-gap="1-5"
          data-ls="wide"
          data-stack="x"
          data-transform="uppercase"
        >
          <CalendarCheck data-size="xs" />
          {t("statistics.exercise.sessions")}
        </div>

        <div data-color="neutral-0" data-fs="xl" data-fw="bold" data-lh="tight">
          {props.performances.length}
        </div>

        <div data-color="neutral-500" data-fs="xs">
          {DateFormat.day(language, DateFormat.zoned(latest.performedAt))}
        </div>
      </li>
    </ul>
  );
}
