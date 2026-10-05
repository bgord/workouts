import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import type { ExercisePerformanceStatistics } from "../../modules/statistics/value-objects/exercise-performance-statistics";
import type { ExerciseRecords } from "../../modules/statistics/value-objects/exercise-records";
import type { Translate } from "../services/translate";
import { ExerciseStatisticsBodyweight } from "./exercise-statistics-bodyweight.kit";
import { ExerciseStatisticsWeighted } from "./exercise-statistics-weighted.kit";

type ExerciseStatisticsKitStrategy<P extends ExercisePerformanceStatistics> = {
  recordLabel: string;
  Tiles(props: { records: ExerciseRecords<P> }): React.ReactNode;
  progress: {
    Label(): React.ReactNode;
    value(performance: P): number;
    format(t: Translate, language: string, value: number): string;
  };
  HistoryRowMetrics(props: { performance: P; previous: P | undefined }): React.ReactNode;
  HistorySetExtra(props: { set: P["sets"][number] }): React.ReactNode;
};

const kit = {
  [ExerciseResistanceOptions.weighted]: ExerciseStatisticsWeighted,
  [ExerciseResistanceOptions.bodyweight]: ExerciseStatisticsBodyweight,
} satisfies {
  [K in ExerciseResistanceOptions]: ExerciseStatisticsKitStrategy<
    Extract<ExercisePerformanceStatistics, { resistance: K }>
  >;
};

export const ExerciseStatisticsKit: Record<
  ExerciseResistanceOptions,
  ExerciseStatisticsKitStrategy<ExercisePerformanceStatistics>
> = kit;
