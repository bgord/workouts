import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseHasChangedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseHasChangedError.prototype);
  }
}

type ExerciseHasChangedConfigType = {
  current: { name: VO.ExerciseNameType; description: VO.ExerciseDescriptionType };
  incoming: { name: VO.ExerciseNameType; description: VO.ExerciseDescriptionType };
};

class ExerciseHasChangedFactory extends bg.Invariant<ExerciseHasChangedConfigType> {
  passes(config: ExerciseHasChangedConfigType) {
    return (
      config.current.name !== config.incoming.name ||
      config.current.description !== config.incoming.description
    );
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.has.changed";
  error = ExerciseHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseHasChanged = new ExerciseHasChangedFactory();
