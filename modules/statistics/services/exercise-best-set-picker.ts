import type * as Auth from "+auth";
import type * as Exercises from "+exercises";
import type * as Workouts from "+workouts";

type ExerciseBestSetPickerConfig = { ListExerciseSetsOHQ: Workouts.OHQ.ListExerciseSetsOHQ };

export class ExerciseBestSetPicker {
  constructor(private readonly config: ExerciseBestSetPickerConfig) {}

  async pick(
    userId: Auth.VO.UserIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ): Promise<Workouts.OHQ.ExerciseSet | null> {
    const sets = await this.config.ListExerciseSetsOHQ.execute(userId, exerciseId);

    let best: Workouts.OHQ.ExerciseSet | null = null;

    for (const set of sets) {
      if (best === null) {
        best = set;
        continue;
      }

      if (set.load > best.load) best = set;
      else if (set.load === best.load && set.reps > best.reps) best = set;
    }

    return best;
  }
}
