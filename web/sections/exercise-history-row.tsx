import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import type { ExercisePerformanceStatistics } from "../../modules/statistics/value-objects/exercise-performance-statistics";
import * as ui from "../components";
import { ExerciseStatisticsKit } from "../kits/exercise-statistics.kit";

export function ExerciseHistoryRow(props: {
  performance: ExercisePerformanceStatistics;
  previous: ExercisePerformanceStatistics | undefined;
  record: boolean;
  index: number;
  last: boolean;
}) {
  const t = bg.useTranslations();
  const Statistics = ExerciseStatisticsKit[props.performance.loading];
  const open = bg.usePersistedToggle({ name: `exercise-history-${props.performance.workoutId}` });

  return (
    <ui.HairlineRow data-stack="y" first={props.index === 0} last={props.last} {...ui.Spacing.row}>
      <div data-stack="x" {...ui.Gap.related}>
        <ui.ChevronToggle label={t("app.details", { name: props.performance.scheduledFor })} {...open} />

        <Link
          data-color="neutral-100"
          data-fw="medium"
          data-hover-color="brand-300"
          data-stack="x"
          data-transform="font-variant-numeric"
          params={{ workoutId: props.performance.workoutId }}
          to="/workouts/$workoutId"
          {...ui.Gap.cluster}
        >
          {props.performance.scheduledFor}

          {props.record && (
            <Trophy aria-label={t(Statistics.recordLabel)} data-color="brand-400" data-size="xs" />
          )}
        </Link>

        <div
          data-cross="baseline"
          data-md-cross="end"
          data-md-stack="y"
          data-ml="auto"
          data-shrink="0"
          data-stack="x"
          {...ui.Gap.related}
        >
          <Statistics.HistoryRowMetrics performance={props.performance} previous={props.previous} />
        </div>
      </div>

      {open.on && (
        <ul data-stack="y" {...ui.Spacing.inset} {...open.props.target}>
          {props.performance.sets.map((set) => (
            <ui.HairlineRow
              data-stack="x"
              data-wrap="wrap"
              key={set.setNumber}
              tone="subtle"
              {...ui.Spacing.rowCompact}
            >
              <ui.RowIndex>{set.setNumber}</ui.RowIndex>

              <div data-color="neutral-100" data-fw="medium">
                <ui.SetValue load={set.load} loading={props.performance.loading} reps={set.reps} />
              </div>

              <div data-grow="1">{set.rir !== null && <ui.RirBadge rir={set.rir} />}</div>

              <Statistics.HistorySetExtra set={set} />
            </ui.HairlineRow>
          ))}
        </ul>
      )}
    </ui.HairlineRow>
  );
}
