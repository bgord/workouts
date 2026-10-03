import * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as Ports from "+statistics/ports";
import type { ExercisePerformanceMetricsStrategy } from "./exercise-performance-metrics.strategy";
import { ExercisePerformanceMetricsLoadStrategy } from "./exercise-performance-metrics-load.strategy";

type Dependencies = { OneRepEstimator: Ports.OneRepEstimatorPort };

export class ExercisePerformanceMetricsStrategyFactory {
  static for(
    loading: Workouts.VO.WorkoutExerciseLoadingType,
    deps: Dependencies,
  ): ExercisePerformanceMetricsStrategy {
    switch (loading) {
      case Exercises.VO.ExerciseLoadingOptions.external:
        return new ExercisePerformanceMetricsLoadStrategy(deps);
    }
  }
}
