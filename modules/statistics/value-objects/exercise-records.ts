import type { ExercisePerformanceStatistics } from "./exercise-performance-statistics";

export type ExerciseRecords<P extends ExercisePerformanceStatistics = ExercisePerformanceStatistics> = {
  peak: P;
  total: P;
};
