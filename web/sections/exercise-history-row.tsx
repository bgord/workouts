import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { EqualApproximately, Sigma, Trophy } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import * as ui from "../components";
import { usePersistedToggle } from "../hooks/use-persisted-toggle";
import { WeightFormat } from "../services/weight-format";

export function ExerciseHistoryRow(props: {
  performance: ExercisePerformance;
  previous: ExercisePerformance | undefined;
  record: boolean;
  index: number;
  last: boolean;
}) {
  const t = bg.useTranslations();
  const open = usePersistedToggle({ name: `exercise-history-${props.performance.workoutId}` });

  return (
    <ui.HairlineRow data-stack="y" first={props.index === 0} last={props.last} {...ui.Spacing.row}>
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        <ui.ChevronToggle {...open} />

        <Link
          data-color="neutral-100"
          data-cross="center"
          data-fs="sm"
          data-fw="medium"
          data-hover-color="brand-300"
          data-stack="x"
          data-transform="font-variant-numeric"
          data-wrap="nowrap"
          params={{ workoutId: props.performance.workoutId }}
          search={WorkoutHistoryFilters.default}
          to="/workouts/$workoutId"
          {...ui.Gap.cluster}
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
          data-md-cross="end"
          data-md-stack="y"
          data-ml="auto"
          data-shrink="0"
          data-stack="x"
          data-wrap="nowrap"
          {...ui.Gap.related}
        >
          <div data-cross="baseline" data-stack="x" data-wrap="nowrap" {...ui.Gap.field}>
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

            <ui.WeightDelta
              current={props.performance.bestEstimate}
              data-fs="xs"
              previous={props.previous?.bestEstimate}
            />
          </div>

          <div data-cross="baseline" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
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

            <ui.WeightDelta
              current={props.performance.volume}
              data-fs="xs"
              previous={props.previous?.volume}
            />
          </div>
        </div>
      </div>

      {open.on && (
        <ul data-stack="y" {...ui.Spacing.inset} {...open.props.target}>
          {props.performance.sets.map((set) => (
            <ui.HairlineRow
              data-cross="center"
              data-stack="x"
              key={set.setNumber}
              tone="subtle"
              {...ui.Spacing.rowCompact}
            >
              <ui.RowIndex>{set.setNumber}</ui.RowIndex>

              <div data-color="neutral-100" data-fs="sm" data-fw="medium">
                <ui.RepsLoad load={set.load} reps={set.reps} />
              </div>

              <div data-grow="1">{set.rir !== undefined && <ui.RirBadge rir={set.rir} />}</div>

              <ui.Meta data-cross="center" data-stack="x" {...ui.Gap.inline}>
                <EqualApproximately data-color="neutral-600" data-size="xs" />
                {t("statistics.exercise.one_rep_max_estimate.value", {
                  load: WeightFormat.kilograms(set.estimate),
                })}
              </ui.Meta>
            </ui.HairlineRow>
          ))}
        </ul>
      )}
    </ui.HairlineRow>
  );
}
