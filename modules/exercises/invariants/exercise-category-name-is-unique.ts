import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class ExerciseCategoryNameIsUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseCategoryNameIsUniqueError.prototype);
  }
}

type ExerciseCategoryNameIsUniqueConfigType = { count: tools.IntegerNonNegativeType };

class ExerciseCategoryNameIsUniqueFactory extends bg.Invariant<ExerciseCategoryNameIsUniqueConfigType> {
  passes(config: ExerciseCategoryNameIsUniqueConfigType) {
    return config.count === 0;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.category.name.is.unique";
  error = ExerciseCategoryNameIsUniqueError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseCategoryNameIsUnique = new ExerciseCategoryNameIsUniqueFactory();
