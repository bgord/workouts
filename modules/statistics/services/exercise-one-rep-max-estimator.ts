import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";
import type * as Ports from "+statistics/ports";
import type * as VO from "+statistics/value-objects";

type ExerciseOneRepMaxEstimatorConfig = {
  OneRepEstimator: Ports.OneRepEstimatorPort;
  ListExerciseSetsOHQ: Workouts.OHQ.ListExerciseSetsOHQ;
};

export class ExerciseOneRepMaxEstimator {
  constructor(private readonly config: ExerciseOneRepMaxEstimatorConfig) {}

  async estimate(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<VO.ExerciseSetOneRepMaxEstimate | null> {
    const sets = await this.config.ListExerciseSetsOHQ.execute(userId, exerciseId);

    let best: VO.ExerciseSetOneRepMaxEstimate | null = null;

    for (const set of sets) {
      const estimate = this.config.OneRepEstimator.estimate(set);

      if (best === null || estimate > best.estimate) best = { set, estimate };
    }

    return best;
  }
}
