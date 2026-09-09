import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Statistics from "+statistics";
import type * as Workouts from "+workouts";

type Dependencies = {
  OneRepEstimator: Statistics.Ports.OneRepEstimatorPort;
  ListExerciseSetsOHQ: Workouts.OHQ.ListExerciseSetsOHQ;
};

class GetExerciseOneRepMaxEstimateInternal implements Statistics.Queries.GetExerciseOneRepMaxEstimate {
  constructor(private readonly deps: Dependencies) {}

  async execute(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<Statistics.VO.OneRepMaxEstimateType | null> {
    const sets = await this.deps.ListExerciseSetsOHQ.execute(userId, exerciseId);

    let best: Statistics.VO.OneRepMaxEstimateType | null = null;

    for (const loggedSet of sets) {
      const estimate = this.deps.OneRepEstimator.estimate(loggedSet);

      if (best === null || estimate > best) best = estimate;
    }

    return best;
  }
}

export function createGetExerciseOneRepMaxEstimate(
  deps: Dependencies,
): Statistics.Queries.GetExerciseOneRepMaxEstimate {
  return new GetExerciseOneRepMaxEstimateInternal(deps);
}
