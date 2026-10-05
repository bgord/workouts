import type * as bg from "@bgord/ui";
import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import type { ExercisePerformanceStatistics } from "../../modules/statistics/value-objects/exercise-performance-statistics";
import { ExerciseStatisticsBodyweight } from "./exercise-statistics-bodyweight";
import { ExerciseStatisticsWeighted } from "./exercise-statistics-weighted";

type Translate = ReturnType<typeof bg.useTranslations>;

type ExerciseStatisticsKitStrategy<P extends ExercisePerformanceStatistics> = {
  record(performances: ReadonlyArray<P>): P | undefined;
  recordLabel: string;
  Tiles(props: { performances: ReadonlyArray<P> }): React.ReactNode;
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

export const performancesOf = (
  resistance: ExerciseResistanceOptions,
  performances: ReadonlyArray<ExercisePerformanceStatistics>,
) => performances.filter((performance) => performance.resistance === resistance);
