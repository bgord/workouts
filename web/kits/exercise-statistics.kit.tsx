import * as bg from "@bgord/ui";
import { EqualApproximately, Sigma, Trophy } from "lucide-react";
import { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import type {
  ExercisePerformanceStatistics,
  ExercisePerformanceStatisticsSet,
} from "../../modules/statistics/value-objects/exercise-performance-statistics";
import { Gap } from "../components/gap";
import { SetValue } from "../components/set-value";
import { Tile, TileContext, TileHeader, TileLink, TileValue } from "../components/tile";
import { WeightDelta } from "../components/weight-delta";
import { WeightFormat } from "../services/weight-format";

type Translate = ReturnType<typeof bg.useTranslations>;

type Performances = ReadonlyArray<ExercisePerformanceStatistics>;

type ExerciseStatisticsKitStrategy = {
  record: (performances: Performances) => ExercisePerformanceStatistics | undefined;
  recordLabel: string;
  Tiles: (props: { performances: Performances }) => React.ReactNode;
  progress: {
    Label: () => React.ReactNode;
    value: (performance: ExercisePerformanceStatistics) => number;
    format: (t: Translate, language: string, value: number) => string;
  };
  HistoryRowMetrics: (props: {
    performance: ExercisePerformanceStatistics;
    previous: ExercisePerformanceStatistics | undefined;
  }) => React.ReactNode;
  HistorySetExtra: (props: { set: ExercisePerformanceStatisticsSet }) => React.ReactNode;
};

const loadRecord = (performances: Performances) =>
  performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];

function LoadTiles(props: { performances: Performances }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const best = loadRecord(props.performances);
  const heaviest = props.performances.toSorted((a, b) => b.volume - a.volume)[0];

  /* v8 ignore next */
  if (!(best && heaviest)) return null;

  return (
    <>
      <TileLink data-hover-bc="brand-500" params={{ workoutId: best.workoutId }} to="/workouts/$workoutId">
        <TileHeader>
          <Trophy data-color="brand-400" data-size="xs" />
          <span data-stack="x">
            <EqualApproximately data-color="neutral-600" data-size="xs" />
            {t("statistics.exercise.one_rep_max_estimate")}
          </span>
        </TileHeader>

        <TileValue>
          {t("statistics.exercise.one_rep_max_estimate.value", {
            load: WeightFormat.kilograms(best.bestEstimate).toLocaleString(language),
          })}
        </TileValue>

        <TileContext>
          <SetValue load={best.bestSet.load} loading={best.loading} reps={best.bestSet.reps} />
        </TileContext>
      </TileLink>

      <Tile>
        <TileHeader>
          <Sigma data-size="xs" />
          {t("statistics.exercise.volume")}
        </TileHeader>

        <TileValue>
          {t("statistics.exercise.history.volume_load.value", {
            load: WeightFormat.kilograms(heaviest.volume).toLocaleString(language),
          })}
        </TileValue>

        <TileContext>{heaviest.scheduledFor}</TileContext>
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
  performance: ExercisePerformanceStatistics;
  previous: ExercisePerformanceStatistics | undefined;
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

function LoadHistorySetExtra(props: { set: ExercisePerformanceStatisticsSet }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <small data-stack="x" {...Gap.inline}>
      <EqualApproximately data-color="neutral-600" data-size="xs" />
      {t("statistics.exercise.one_rep_max_estimate.value", {
        load: WeightFormat.kilograms(props.set.estimate).toLocaleString(language),
      })}
    </small>
  );
}

export const ExerciseStatisticsKit = {
  [ExerciseLoadingOptions.external]: {
    record: loadRecord,
    recordLabel: "statistics.exercise.one_rep_max_estimate",
    Tiles: LoadTiles,
    progress: {
      Label: LoadProgressLabel,
      value: (performance) => WeightFormat.kilograms(performance.bestEstimate),
      format: (t, language, value) =>
        t("statistics.exercise.one_rep_max_estimate.value", { load: value.toLocaleString(language) }),
    },
    HistoryRowMetrics: LoadHistoryRowMetrics,
    HistorySetExtra: LoadHistorySetExtra,
  },
} satisfies Record<ExerciseLoadingOptions, ExerciseStatisticsKitStrategy>;
