import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as Ports from "+statistics/ports";
import type * as VO from "+statistics/value-objects";
import { ExercisePerformanceMetricsStrategyFactory } from "./exercise-performance-metrics-factory.strategy";

type Config = {
  OneRepEstimator: Ports.OneRepEstimatorPort;
  ListExercisePerformancesOHQ: Workouts.OHQ.ListExercisePerformancesOHQ;
};

export class ExercisePerformanceCalculator {
  constructor(private readonly config: Config) {}

  async calculate(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<Array<VO.ExercisePerformanceStatistics>> {
    const performances = await this.config.ListExercisePerformancesOHQ.execute(userId, exerciseId);

    return performances.map((performance) =>
      ExercisePerformanceMetricsStrategyFactory.for(performance.loading, this.config).calculate(performance),
    );
  }
}
