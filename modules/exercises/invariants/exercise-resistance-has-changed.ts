import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseResistanceHasChangedError extends Error {}

type ExerciseResistanceHasChangedConfigType = {
  current: VO.ExerciseResistanceType;
  incoming: VO.ExerciseResistanceType;
};

class ExerciseResistanceHasChangedFactory extends bg.Invariant<ExerciseResistanceHasChangedConfigType> {
  passes(config: ExerciseResistanceHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.resistance.has.changed";
  error = ExerciseResistanceHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseResistanceHasChanged = new ExerciseResistanceHasChangedFactory();
