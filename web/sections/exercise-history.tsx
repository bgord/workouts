import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { EqualApproximately, Sigma, Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { ChevronToggle, HairlineRow, Meta } from "../components";
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
    <HairlineRow
      data-gap="2"
      data-pb={props.last ? undefined : "3"}
      data-pt={props.index === 0 ? undefined : "3"}
      data-stack="y"
      first={props.index === 0}
    >
      <div data-cross="center" data-gap="3" data-md-gap="2" data-stack="x" data-wrap="nowrap">
        <ChevronToggle {...open} />

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
            <HairlineRow
              data-cross="center"
              data-gap="3"
              data-py="1-5"
              data-stack="x"
              first={position === 0}
              key={set.setNumber}
              tone="subtle"
            >
              <div data-color="neutral-600" data-fs="xs" data-transform="font-variant-numeric">
                {set.setNumber}
              </div>

              <div data-color="neutral-100" data-fs="sm" data-fw="medium">
                <RepsLoad load={set.load} reps={set.reps} />
              </div>

              <div data-grow="1">{set.rir !== undefined && <RirBadge rir={set.rir} />}</div>

              <Meta data-cross="center" data-gap="1" data-stack="x">
                <EqualApproximately data-color="neutral-600" data-size="xs" />
                {t("statistics.exercise.one_rep_max_estimate.value", {
                  load: WeightFormat.kilograms(set.estimate),
                })}
              </Meta>
            </HairlineRow>
          ))}
        </ul>
      )}
    </HairlineRow>
  );
}
