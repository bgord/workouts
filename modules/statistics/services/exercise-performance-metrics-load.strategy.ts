import * as Exercises from "+exercises";
import * as Workouts from "+workouts";
import type * as Ports from "+statistics/ports";
import type * as VO from "+statistics/value-objects";
import type { ExercisePerformanceMetricsStrategy } from "./exercise-performance-metrics.strategy";

type Dependencies = { OneRepEstimator: Ports.OneRepEstimatorPort };

export class ExercisePerformanceMetricsLoadStrategy implements ExercisePerformanceMetricsStrategy {
  constructor(private readonly deps: Dependencies) {}

  calculate(performance: Workouts.Queries.ExercisePerformance): VO.ExercisePerformanceStatistics {
    const sets = performance.sets.map((set) => ({
      ...set,
      estimate: this.deps.OneRepEstimator.estimate(set),
    }));

    const bestSet = sets.reduce((best, set) => (set.estimate > best.estimate ? set : best));

    return {
      ...performance,
      loading: Exercises.VO.ExerciseLoadingOptions.external,
      sets,
      volume: new Workouts.Services.LoggedSetsVolume(sets).calculate().get(),
      bestSet,
      bestEstimate: bestSet.estimate,
    };
  }
}
