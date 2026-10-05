import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export interface ExercisePerformanceMetricsStrategy<
  P extends VO.ExercisePerformanceStatistics = VO.ExercisePerformanceStatistics,
> {
  calculate(performance: Workouts.Queries.ExercisePerformance): P;
  records(performances: ReadonlyArray<P>): VO.ExerciseRecords<P>;
}
