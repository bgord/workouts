import * as Exercises from "+exercises";
import * as Workouts from "+workouts";
import type * as Ports from "+statistics/ports";
import type * as VO from "+statistics/value-objects";
import type { ExercisePerformanceMetricsStrategy } from "./exercise-performance-metrics.strategy";

type Dependencies = { OneRepEstimator: Ports.OneRepEstimatorPort };

export class ExercisePerformanceMetricsWeightedStrategy
  implements ExercisePerformanceMetricsStrategy<VO.WeightedExercisePerformanceStatistics>
{
  constructor(private readonly deps: Dependencies) {}

  calculate(performance: Workouts.Queries.ExercisePerformance): VO.WeightedExercisePerformanceStatistics {
    const sets = performance.sets.map((set) => ({
      ...set,
      estimate: this.deps.OneRepEstimator.estimate(set),
    }));

    const bestSet = sets.reduce((best, set) => (set.estimate > best.estimate ? set : best));

    return {
      ...performance,
      resistance: Exercises.VO.ExerciseResistanceOptions.weighted,
      sets,
      volume: new Workouts.Services.LoggedSetsVolume(sets).calculate().get(),
      bestSet,
      bestEstimate: bestSet.estimate,
    };
  }

  records(
    performances: ReadonlyArray<VO.WeightedExercisePerformanceStatistics>,
  ): VO.ExerciseRecords<VO.WeightedExercisePerformanceStatistics> {
    return {
      peak: performances.reduce((best, performance) =>
        performance.bestEstimate > best.bestEstimate ? performance : best,
      ),
      total: performances.reduce((best, performance) =>
        performance.volume > best.volume ? performance : best,
      ),
    };
  }
}
