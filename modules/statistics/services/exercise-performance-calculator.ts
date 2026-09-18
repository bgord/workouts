import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as Ports from "+statistics/ports";
import type * as VO from "+statistics/value-objects";

type Config = {
  OneRepEstimator: Ports.OneRepEstimatorPort;
  ListExercisePerformances: Workouts.Queries.ListExercisePerformances;
};

export class ExercisePerformanceCalculator {
  constructor(private readonly config: Config) {}

  async calculate(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<Array<VO.ExercisePerformance>> {
    const performances = await this.config.ListExercisePerformances.execute(userId, exerciseId);

    return performances.map((performance) => {
      const sets = performance.sets.map((set) => ({
        ...set,
        estimate: this.config.OneRepEstimator.estimate(set),
      }));

      const bestSet = sets.reduce((best, set) => (set.estimate > best.estimate ? set : best));

      return {
        ...performance,
        sets,
        volume: v.parse(
          tools.WeightGrams,
          sets.reduce((total, set) => total + set.reps * set.load, 0),
        ),
        bestSet,
        bestEstimate: bestSet.estimate,
      };
    });
  }
}
