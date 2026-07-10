import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class ExerciseNameIsUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseNameIsUniqueError.prototype);
  }
}

type ExerciseNameIsUniqueConfigType = { count: tools.IntegerNonNegativeType };

class ExerciseNameIsUniqueFactory extends bg.Invariant<ExerciseNameIsUniqueConfigType> {
  passes(config: ExerciseNameIsUniqueConfigType) {
    return config.count === 0;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.name.is.unique";
  error = ExerciseNameIsUniqueError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseNameIsUnique = new ExerciseNameIsUniqueFactory();
