import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class ExerciseIsNotUsedError extends Error {}

type ExerciseIsNotUsedConfigType = { count: tools.IntegerNonNegativeType };

class ExerciseIsNotUsedFactory extends bg.Invariant<ExerciseIsNotUsedConfigType> {
  passes(config: ExerciseIsNotUsedConfigType) {
    return config.count === 0;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.is.not.used";
  error = ExerciseIsNotUsedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseIsNotUsed = new ExerciseIsNotUsedFactory();
