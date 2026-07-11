import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseIsNotAssignedToCategoryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseIsNotAssignedToCategoryError.prototype);
  }
}

type ExerciseIsNotAssignedToCategoryConfigType = {
  exerciseCategoryId: VO.ExerciseCategoryIdType;
  exerciseCategories: ReadonlyArray<VO.ExerciseCategoryIdType>;
};

class ExerciseIsNotAssignedToCategoryFactory extends bg.Invariant<ExerciseIsNotAssignedToCategoryConfigType> {
  passes(config: ExerciseIsNotAssignedToCategoryConfigType) {
    return !config.exerciseCategories.includes(config.exerciseCategoryId);
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.is.not.assigned.to.category";
  error = ExerciseIsNotAssignedToCategoryError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseIsNotAssignedToCategory = new ExerciseIsNotAssignedToCategoryFactory();
