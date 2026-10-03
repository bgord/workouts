import * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";
import { LoadStepIncrementStrategy } from "./load-step-increment.strategy";
import { LoadStepLockedStrategy } from "./load-step-locked.strategy";

export class LoadStepStrategyFactory {
  static for(loading: VO.WorkoutExerciseLoadingType): LoadStepStrategy {
    switch (loading) {
      case Exercises.VO.ExerciseLoadingOptions.external:
        return new LoadStepIncrementStrategy();
      case Exercises.VO.ExerciseLoadingOptions.none:
        return new LoadStepLockedStrategy();
    }
  }
}
