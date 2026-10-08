import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import * as Workouts from "+workouts";
import type * as VO from "+statistics/value-objects";
import type { ExercisePerformanceMetricsStrategy } from "./exercise-performance-metrics.strategy";

export class ExercisePerformanceMetricsBodyweightStrategy
  implements ExercisePerformanceMetricsStrategy<VO.BodyweightExercisePerformanceStatistics>
{
  calculate(performance: Workouts.Queries.ExercisePerformance): VO.BodyweightExercisePerformanceStatistics {
    const bestSet = performance.sets.reduce((best, set) => (set.reps > best.reps ? set : best));

    return {
      ...performance,
      resistance: Exercises.VO.ExerciseResistanceOptions.bodyweight,
      bestSet,
      totalReps: tools.Int.positive(
        performance.sets.reduce(
          (total, set) => total + set.reps * Workouts.VO.WorkoutExerciseSides[performance.laterality],
          0,
        ),
      ),
    };
  }

  records(
    performances: ReadonlyArray<VO.BodyweightExercisePerformanceStatistics>,
  ): VO.ExerciseRecords<VO.BodyweightExercisePerformanceStatistics> {
    return {
      peak: performances.reduce((best, performance) =>
        performance.bestSet.reps > best.bestSet.reps ? performance : best,
      ),
      total: performances.reduce((best, performance) =>
        performance.totalReps > best.totalReps ? performance : best,
      ),
    };
  }
}
