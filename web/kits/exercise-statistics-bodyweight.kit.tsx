import * as bg from "@bgord/ui";
import { ChevronsUp, Sigma, Trophy } from "lucide-react";
import type { BodyweightExercisePerformanceStatistics } from "../../modules/statistics/value-objects/exercise-performance-statistics";
import type { ExerciseRecords } from "../../modules/statistics/value-objects/exercise-records";
import { CountDelta } from "../components/count-delta";
import { Gap } from "../components/gap";
import { Tile, TileContext, TileHeader, TileLink, TileValue } from "../components/tile";
import type { Translate } from "../services/translate";

const repsValue = (t: Translate, language: string, value: number) =>
  t("statistics.exercise.reps.value", { value: value.toLocaleString(language) });

function RepsTiles(props: { records: ExerciseRecords<BodyweightExercisePerformanceStatistics> }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  const { peak, total } = props.records;

  return (
    <>
      <TileLink data-hover-bc="brand-500" params={{ workoutId: peak.workoutId }} to="/workouts/$workoutId">
        <TileHeader>
          <Trophy data-color="brand-400" data-size="xs" />
          {t("statistics.exercise.max_reps")}
        </TileHeader>

        <TileValue>{repsValue(t, language, peak.bestSet.reps)}</TileValue>

        <TileContext>{peak.scheduledFor}</TileContext>
      </TileLink>

      <Tile>
        <TileHeader>
          <Sigma data-size="xs" />
          {t("statistics.exercise.total_reps")}
        </TileHeader>

        <TileValue>{repsValue(t, language, total.totalReps)}</TileValue>

        <TileContext>{total.scheduledFor}</TileContext>
      </Tile>
    </>
  );
}

function RepsProgressLabel() {
  const t = bg.useTranslations();

  return <>{t("statistics.exercise.max_reps")}</>;
}

function RepsHistoryRowMetrics(props: {
  performance: BodyweightExercisePerformanceStatistics;
  previous: BodyweightExercisePerformanceStatistics | undefined;
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

export const ExerciseStatisticsBodyweight = {
  recordLabel: "statistics.exercise.max_reps",
  Tiles: RepsTiles,
  progress: {
    Label: RepsProgressLabel,
    value: (performance: BodyweightExercisePerformanceStatistics) => performance.bestSet.reps,
    format: repsValue,
  },
  HistoryRowMetrics: RepsHistoryRowMetrics,
  HistorySetExtra: () => null,
};
