import * as bg from "@bgord/ui";
import { ChevronsUp, Sigma, Trophy } from "lucide-react";
import type { RepsExercisePerformanceStatistics } from "../../modules/statistics/value-objects/exercise-performance-statistics";
import { CountDelta } from "../components/count-delta";
import { Gap } from "../components/gap";
import { Tile, TileContext, TileHeader, TileLink, TileValue } from "../components/tile";

type Translate = ReturnType<typeof bg.useTranslations>;

type Performances = ReadonlyArray<RepsExercisePerformanceStatistics>;

const repsRecord = (performances: Performances) =>
  performances.toSorted((a, b) => b.bestSet.reps - a.bestSet.reps)[0];

const repsValue = (t: Translate, language: string, value: number) =>
  t("statistics.exercise.reps.value", { value: value.toLocaleString(language) });

function RepsTiles(props: { performances: Performances }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const best = repsRecord(props.performances);
  const highest = props.performances.toSorted((a, b) => b.totalReps - a.totalReps)[0];

  /* v8 ignore next */
  if (!(best && highest)) return null;

  return (
    <>
      <TileLink data-hover-bc="brand-500" params={{ workoutId: best.workoutId }} to="/workouts/$workoutId">
        <TileHeader>
          <Trophy data-color="brand-400" data-size="xs" />
          {t("statistics.exercise.max_reps")}
        </TileHeader>

        <TileValue>{repsValue(t, language, best.bestSet.reps)}</TileValue>

        <TileContext>{best.scheduledFor}</TileContext>
      </TileLink>

      <Tile>
        <TileHeader>
          <Sigma data-size="xs" />
          {t("statistics.exercise.total_reps")}
        </TileHeader>

        <TileValue>{repsValue(t, language, highest.totalReps)}</TileValue>

        <TileContext>{highest.scheduledFor}</TileContext>
      </Tile>
    </>
  );
}

function RepsProgressLabel() {
  const t = bg.useTranslations();

  return <>{t("statistics.exercise.max_reps")}</>;
}

function RepsHistoryRowMetrics(props: {
  performance: RepsExercisePerformanceStatistics;
  previous: RepsExercisePerformanceStatistics | undefined;
}) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (
    <>
      <div data-cross="baseline" data-stack="x" {...Gap.field}>
        <ChevronsUp data-color="neutral-600" data-self="center" data-size="xs" />

        <span data-color="neutral-300" data-fw="medium" data-transform="font-variant-numeric">
          {repsValue(t, language, props.performance.bestSet.reps)}
        </span>

        <CountDelta
          current={props.performance.bestSet.reps}
          data-fs="xs"
          previous={props.previous?.bestSet.reps}
        />
      </div>

      <div data-cross="baseline" data-stack="x" {...Gap.inline}>
        <Sigma data-color="neutral-600" data-self="center" data-size="xs" />

        <span data-color="neutral-300" data-fw="medium" data-transform="font-variant-numeric">
          {repsValue(t, language, props.performance.totalReps)}
        </span>

        <CountDelta current={props.performance.totalReps} data-fs="xs" previous={props.previous?.totalReps} />
      </div>
    </>
  );
}

export const ExerciseStatisticsReps = {
  record: repsRecord,
  recordLabel: "statistics.exercise.max_reps",
  Tiles: RepsTiles,
  progress: {
    Label: RepsProgressLabel,
    value: (performance: RepsExercisePerformanceStatistics) => performance.bestSet.reps,
    format: repsValue,
  },
  HistoryRowMetrics: RepsHistoryRowMetrics,
  HistorySetExtra: () => null,
};
