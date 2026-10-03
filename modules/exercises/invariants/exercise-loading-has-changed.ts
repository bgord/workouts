import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseLoadingHasChangedError extends Error {}

type ExerciseLoadingHasChangedConfigType = {
  current: VO.ExerciseLoadingType;
  incoming: VO.ExerciseLoadingType;
};

class ExerciseLoadingHasChangedFactory extends bg.Invariant<ExerciseLoadingHasChangedConfigType> {
  passes(config: ExerciseLoadingHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.loading.has.changed";
  error = ExerciseLoadingHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseLoadingHasChanged = new ExerciseLoadingHasChangedFactory();
