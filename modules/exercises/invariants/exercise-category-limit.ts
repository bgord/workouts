import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseCategoryLimitError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseCategoryLimitError.prototype);
  }
}

type ExerciseCategoryLimitConfigType = { exerciseCategories: ReadonlyArray<VO.ExerciseCategoryIdType> };

class ExerciseCategoryLimitFactory extends bg.Invariant<ExerciseCategoryLimitConfigType> {
  passes(config: ExerciseCategoryLimitConfigType) {
    return config.exerciseCategories.length <= 4;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.category.limit";
  error = ExerciseCategoryLimitError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseCategoryLimit = new ExerciseCategoryLimitFactory();
