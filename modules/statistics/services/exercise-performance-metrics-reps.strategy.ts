import * as tools from "@bgord/tools";
import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";

export class ExercisePerformanceMetricsRepsStrategy {
  calculate(performance: Workouts.Queries.ExercisePerformance): VO.RepsPerformanceStatistics {
    const { loading, ...rest } = performance;

    const bestSet = rest.sets.reduce((best, set) => (set.reps > best.reps ? set : best));

    return {
      ...rest,
      bestSet,
      totalReps: tools.Int.positive(rest.sets.reduce((total, set) => total + set.reps, 0)),
    };
  }
}
