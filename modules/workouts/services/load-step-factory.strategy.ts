import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";
import { LoadStepIncrementStrategy } from "./load-step-increment.strategy";
import { LoadStepLockedStrategy } from "./load-step-locked.strategy";
import { LoadStepRackStrategy } from "./load-step-rack.strategy";

export class LoadStepStrategyFactory {
  static for(loadStep: Exercises.VO.ExerciseLoadStepType): LoadStepStrategy {
    switch (loadStep) {
      case Exercises.VO.ExerciseLoadStepOptions.none:
        return new LoadStepLockedStrategy();
      case Exercises.VO.ExerciseLoadStepOptions.kg_1:
        return new LoadStepIncrementStrategy({ step: tools.Weight.fromKilograms(1) });
      case Exercises.VO.ExerciseLoadStepOptions.kg_2_5:
        return new LoadStepIncrementStrategy({ step: tools.Weight.fromKilograms(2.5) });
      case Exercises.VO.ExerciseLoadStepOptions.kg_5:
        return new LoadStepIncrementStrategy({ step: tools.Weight.fromKilograms(5) });
      case Exercises.VO.ExerciseLoadStepOptions.kg_10:
        return new LoadStepIncrementStrategy({ step: tools.Weight.fromKilograms(10) });
      case Exercises.VO.ExerciseLoadStepOptions.dumbbell_rack:
        return new LoadStepRackStrategy({ rack: VO.DumbbellRack });
    }
  }
}
