import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, EqualApproximately, Sigma, Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { DeltaKg } from "../components/delta-kg";
import { RepsLoad } from "../components/reps-load";
import { RirBadge } from "../components/rir-badge";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { WeightFormat } from "../services/weight-format";

export function ExerciseHistory(props: { performances: Array<ExercisePerformance> }) {
  const performances = props.performances.toReversed();
  const record = props.performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];

  return (
    <ul data-stack="y">
      {performances.map((performance, index) => (
        <ExerciseHistoryRow
          index={index}
          key={performance.workoutId}
          last={index === performances.length - 1}
          performance={performance}
          previous={performances[index + 1]}
          record={performance.workoutId === record?.workoutId}
        />
      ))}
    </ul>
  );
}

function ExerciseHistoryRow(props: {
  performance: ExercisePerformance;
  previous: ExercisePerformance | undefined;
  record: boolean;
  index: number;
  last: boolean;
}) {
  const t = useTranslations();
  const open = usePersistedToggle({ name: `exercise-history-${props.performance.workoutId}` });

  return (
    <li
      data-bct={props.index === 0 ? undefined : "alpha-soft"}
      data-bst={props.index === 0 ? undefined : "solid"}
      data-bwt={props.index === 0 ? undefined : "hairline"}
      data-gap="2"
      data-pb={props.last ? undefined : "3"}
      data-pt={props.index === 0 ? undefined : "3"}
      data-stack="y"
    >
      <div data-cross="center" data-gap="3" data-md-gap="2" data-stack="x" data-wrap="nowrap">
        <button
          aria-label={open.on ? t("workout.exercise.collapse") : t("workout.exercise.expand")}
          data-color="neutral-400"
          data-cursor="pointer"
          data-hover-color="neutral-0"
          data-md-p="1"
          data-p="2-5"
          data-shrink="0"
          data-stack="x"
          onClick={open.toggle}
          title={open.on ? t("workout.exercise.collapse") : t("workout.exercise.expand")}
          type="button"
          {...open.props.controller}
        >
          {open.on ? <ChevronDown data-size="sm" /> : <ChevronRight data-size="sm" />}
        </button>

        <Link
          data-color="neutral-100"
          data-cross="center"
          data-fs="sm"
          data-fw="medium"
          data-gap="1-5"
          data-hover-color="brand-300"
          data-stack="x"
          data-transform="font-variant-numeric"
          data-wrap="nowrap"
          params={{ workoutId: props.performance.workoutId }}
          search={WorkoutHistoryFilters.default}
          to="/workouts/$workoutId"
        >
          {props.performance.scheduledFor}

          {props.record && (
            <Trophy
              aria-label={t("statistics.exercise.one_rep_max_estimate")}
              data-color="brand-400"
              data-size="xs"
            />
          )}
        </Link>

        <div
          data-cross="baseline"
          data-gap="4"
          data-md-cross="end"
          data-md-gap="0-5"
          data-md-stack="y"
          data-ml="auto"
          data-shrink="0"
          data-stack="x"
          data-wrap="nowrap"
        >
          <div data-cross="baseline" data-gap="1-5" data-stack="x" data-wrap="nowrap">
            <EqualApproximately data-color="neutral-600" data-self="center" data-size="xs" />

            <span
              data-color="neutral-300"
              data-fs="sm"
              data-fw="medium"
              data-transform="font-variant-numeric"
            >
              {t("statistics.exercise.one_rep_max_estimate.value", {
                load: WeightFormat.kilograms(props.performance.bestEstimate),
              })}
            </span>

            <span data-fs="xs">
              <DeltaKg current={props.performance.bestEstimate} previous={props.previous?.bestEstimate} />
            </span>
          </div>

          <div data-cross="baseline" data-gap="1-5" data-stack="x" data-wrap="nowrap">
            <Sigma data-color="neutral-600" data-self="center" data-size="xs" />

            <span
              data-color="neutral-300"
              data-fs="sm"
              data-fw="medium"
              data-transform="font-variant-numeric"
            >
              {t("statistics.exercise.history.volume_load.value", {
                load: WeightFormat.kilograms(props.performance.volume),
              })}
            </span>

            <span data-fs="xs">
              <DeltaKg current={props.performance.volume} previous={props.previous?.volume} />
            </span>
          </div>
        </div>
      </div>

      {open.on && (
        <ul data-md-pl="0" data-pl="12" data-stack="y" {...open.props.target}>
          {props.performance.sets.map((set, position) => (
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

              <div data-color="neutral-500" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
                <EqualApproximately data-color="neutral-600" data-size="xs" />
                {t("statistics.exercise.one_rep_max_estimate.value", {
                  load: WeightFormat.kilograms(set.estimate),
                })}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
