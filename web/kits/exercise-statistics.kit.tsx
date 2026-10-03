import type * as bg from "@bgord/ui";
import { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import type {
  ExercisePerformanceStatistics,
  ExercisePerformanceStatisticsSet,
} from "../../modules/statistics/value-objects/exercise-performance-statistics";
import { ExerciseStatisticsLoad } from "./exercise-statistics-load";

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

export const ExerciseStatisticsKit = {
  [ExerciseLoadingOptions.external]: ExerciseStatisticsLoad,
} satisfies Record<ExerciseLoadingOptions, ExerciseStatisticsKitStrategy>;
