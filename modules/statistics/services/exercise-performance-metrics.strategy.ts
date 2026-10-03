import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export interface ExercisePerformanceMetricsStrategy {
  calculate(performance: Workouts.Queries.ExercisePerformance): VO.ExercisePerformanceStatistics;
}
