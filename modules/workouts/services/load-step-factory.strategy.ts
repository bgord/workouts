import * as Exercises from "+exercises";
import type * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";
import { LoadStepIncrementStrategy } from "./load-step-increment.strategy";
import { LoadStepLockedStrategy } from "./load-step-locked.strategy";

export class LoadStepStrategyFactory {
  static for(resistance: VO.WorkoutExerciseResistanceType): LoadStepStrategy {
    switch (resistance) {
      case Exercises.VO.ExerciseResistanceOptions.weighted:
        return new LoadStepIncrementStrategy();
      case Exercises.VO.ExerciseResistanceOptions.bodyweight:
        return new LoadStepLockedStrategy();
    }
  }
}
