import type * as bg from "@bgord/ui";
import { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import type { ExercisePerformanceStatistics } from "../../modules/statistics/value-objects/exercise-performance-statistics";
import { ExerciseStatisticsLoad } from "./exercise-statistics-load";
import { ExerciseStatisticsReps } from "./exercise-statistics-reps";

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
  [ExerciseLoadingOptions.external]: ExerciseStatisticsLoad,
  [ExerciseLoadingOptions.none]: ExerciseStatisticsReps,
} satisfies {
  [K in ExerciseLoadingOptions]: ExerciseStatisticsKitStrategy<
    Extract<ExercisePerformanceStatistics, { loading: K }>
  >;
};

export const ExerciseStatisticsKit: Record<
  ExerciseLoadingOptions,
  ExerciseStatisticsKitStrategy<ExercisePerformanceStatistics>
> = kit;

export const performancesOf = (
  loading: ExerciseLoadingOptions,
  performances: ReadonlyArray<ExercisePerformanceStatistics>,
) => performances.filter((performance) => performance.loading === loading);
