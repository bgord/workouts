import * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as Ports from "+statistics/ports";
import type { ExercisePerformanceMetricsStrategy } from "./exercise-performance-metrics.strategy";
import { ExercisePerformanceMetricsLoadStrategy } from "./exercise-performance-metrics-load.strategy";
import { ExercisePerformanceMetricsRepsStrategy } from "./exercise-performance-metrics-reps.strategy";

type Dependencies = { OneRepEstimator: Ports.OneRepEstimatorPort };

export class ExercisePerformanceMetricsStrategyFactory {
  static for(
    resistance: Workouts.VO.WorkoutExerciseResistanceType,
    deps: Dependencies,
  ): ExercisePerformanceMetricsStrategy {
    switch (resistance) {
      case Exercises.VO.ExerciseResistanceOptions.weighted:
        return new ExercisePerformanceMetricsLoadStrategy(deps);
      case Exercises.VO.ExerciseResistanceOptions.bodyweight:
        return new ExercisePerformanceMetricsRepsStrategy();
    }
  }
}
