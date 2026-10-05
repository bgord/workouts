import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";
import type { ExercisePerformanceMetricsStrategy } from "./exercise-performance-metrics.strategy";

export class ExercisePerformanceMetricsRepsStrategy implements ExercisePerformanceMetricsStrategy {
  calculate(performance: Workouts.Queries.ExercisePerformance): VO.ExercisePerformanceStatistics {
    const bestSet = performance.sets.reduce((best, set) => (set.reps > best.reps ? set : best));

    return {
      ...performance,
      resistance: Exercises.VO.ExerciseResistanceOptions.bodyweight,
      bestSet,
      totalReps: tools.Int.positive(performance.sets.reduce((total, set) => total + set.reps, 0)),
    };
  }
}
