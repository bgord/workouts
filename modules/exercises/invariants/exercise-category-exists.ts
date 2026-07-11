import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseCategoryExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseCategoryExistsError.prototype);
  }
}

type ExerciseCategoryExistsConfigType = { exerciseCategory: VO.ExerciseCategory | null };

class ExerciseCategoryExistsFactory extends bg.Invariant<ExerciseCategoryExistsConfigType> {
  passes(config: ExerciseCategoryExistsConfigType) {
    return config.exerciseCategory !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.category.exists";
  error = ExerciseCategoryExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseCategoryExists = new ExerciseCategoryExistsFactory();
