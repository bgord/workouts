import type { ExercisePerformanceStatistics } from "./exercise-performance-statistics";
import type { ExerciseRecords } from "./exercise-records";

export type ExerciseStatistics = {
  performances: Array<ExercisePerformanceStatistics>;
  records: ExerciseRecords | null;
};
