import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseIsAssignedToCategoryError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ExerciseIsAssignedToCategoryError.prototype);
  }
}

type ExerciseIsAssignedToCategoryConfigType = {
  exerciseCategoryId: VO.ExerciseCategoryIdType;
  exerciseCategories: ReadonlyArray<VO.ExerciseCategory>;
};

class ExerciseIsAssignedToCategoryFactory extends bg.Invariant<ExerciseIsAssignedToCategoryConfigType> {
  passes(config: ExerciseIsAssignedToCategoryConfigType) {
    return config.exerciseCategories
      .map((exerciseCategory) => exerciseCategory.id)
      .includes(config.exerciseCategoryId);
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.is.assigned.to.category";
  error = ExerciseIsAssignedToCategoryError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseIsAssignedToCategory = new ExerciseIsAssignedToCategoryFactory();
