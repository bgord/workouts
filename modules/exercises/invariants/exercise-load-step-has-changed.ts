import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseLoadStepHasChangedError extends Error {}

type ExerciseLoadStepHasChangedConfigType = {
  current: VO.ExerciseLoadStepType;
  incoming: VO.ExerciseLoadStepType;
};

class ExerciseLoadStepHasChangedFactory extends bg.Invariant<ExerciseLoadStepHasChangedConfigType> {
  passes(config: ExerciseLoadStepHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.load.step.has.changed";
  error = ExerciseLoadStepHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseLoadStepHasChanged = new ExerciseLoadStepHasChangedFactory();
