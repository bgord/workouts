import * as bg from "@bgord/ui";
import { EqualApproximately, Sigma, Trophy } from "lucide-react";
import type {
  WeightedExercisePerformanceStatistics,
  WeightedExercisePerformanceStatisticsSet,
} from "../../modules/statistics/value-objects/exercise-performance-statistics";
import type { ExerciseRecords } from "../../modules/statistics/value-objects/exercise-records";
import { DateTime } from "../components/date-time";
import { Gap } from "../components/gap";
import { SetValue } from "../components/set-value";
import { Tile, TileContext, TileHeader, TileLink, TileValue } from "../components/tile";
import { WeightDelta } from "../components/weight-delta";
import { WeightFormat } from "../services/weight-format";

function LoadTiles(props: { records: ExerciseRecords<WeightedExercisePerformanceStatistics> }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const { peak, total } = props.records;

  return (
    <>
      <TileLink data-hover-bc="brand-500" params={{ workoutId: peak.workoutId }} to="/workouts/$workoutId">
        <TileHeader>
          <Trophy data-color="brand-400" data-size="xs" />
          <span data-stack="x">
            <EqualApproximately data-color="neutral-600" data-size="xs" />
            {t("statistics.exercise.one_rep_max_estimate")}
          </span>
        </TileHeader>

        <TileValue>
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: WeightFormat.kilograms(peak.bestEstimate).toLocaleString(language),
          })}
        </TileValue>

        <TileContext>
          <SetValue load={peak.bestSet.load} reps={peak.bestSet.reps} resistance={peak.resistance} />
        </TileContext>
      </TileLink>

      <Tile>
        <TileHeader>
          <Sigma data-size="xs" />
          {t("statistics.exercise.volume")}
        </TileHeader>

        <TileValue>
          {t("statistics.exercise.history.volume_load.value", {
            load: WeightFormat.kilograms(total.volume).toLocaleString(language),
          })}
        </TileValue>

        <TileContext>
          <DateTime format="short" value={total.scheduledFor} />
        </TileContext>
      </Tile>
    </>
  );
}

function LoadProgressLabel() {
  const t = bg.useTranslations();

  return (
    <>
      <EqualApproximately data-color="neutral-600" data-size="xs" />
      {t("statistics.exercise.one_rep_max_estimate")}
    </>
  );
}

function LoadHistoryRowMetrics(props: {
  performance: WeightedExercisePerformanceStatistics;
  previous: WeightedExercisePerformanceStatistics | undefined;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <>
      <div data-cross="baseline" data-stack="x" {...Gap.field}>
        <EqualApproximately data-color="neutral-600" data-self="center" data-size="xs" />

        <span data-color="neutral-300" data-fw="medium" data-transform="font-variant-numeric">
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: WeightFormat.kilograms(props.performance.bestEstimate).toLocaleString(language),
          })}
        </span>

        <WeightDelta
          current={props.performance.bestEstimate}
          data-fs="xs"
          previous={props.previous?.bestEstimate}
        />
      </div>

      <div data-cross="baseline" data-stack="x" {...Gap.inline}>
        <Sigma data-color="neutral-600" data-self="center" data-size="xs" />

        <span data-color="neutral-300" data-fw="medium" data-transform="font-variant-numeric">
          {t("statistics.exercise.history.volume_load.value", {
            load: WeightFormat.kilograms(props.performance.volume).toLocaleString(language),
          })}
        </span>

        <WeightDelta current={props.performance.volume} data-fs="xs" previous={props.previous?.volume} />
      </div>
    </>
  );
}

function LoadHistorySetExtra(props: { set: WeightedExercisePerformanceStatisticsSet }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <small data-cross="baseline" data-stack="x" {...Gap.inline}>
      <EqualApproximately data-color="neutral-600" data-self="center" data-size="xs" />
      {t("statistics.exercise.one_rep_max_estimate.value", {
        load: WeightFormat.kilograms(props.set.estimate).toLocaleString(language),
      })}
    </small>
  );
}

export const ExerciseStatisticsWeighted = {
  recordLabel: "statistics.exercise.one_rep_max_estimate",
  Tiles: LoadTiles,
  progress: {
    Label: LoadProgressLabel,
    value: (performance: WeightedExercisePerformanceStatistics) =>
      WeightFormat.kilograms(performance.bestEstimate),
    format: (t: bg.TranslateType, language: string, value: number) =>
      t("statistics.exercise.one_rep_max_estimate.value", { load: value.toLocaleString(language) }),
  },
  HistoryRowMetrics: LoadHistoryRowMetrics,
  HistorySetExtra: LoadHistorySetExtra,
};
