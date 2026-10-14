import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseIsAssignedToCategoryError extends Error {}

type ExerciseIsAssignedToCategoryConfigType = {
  assignment: Pick<VO.ExerciseCategoryAssignment, "id"> | undefined;
};
type ExerciseIsAssignedToCategoryPassedConfigType = { assignment: Pick<VO.ExerciseCategoryAssignment, "id"> };

class ExerciseIsAssignedToCategoryFactory extends bg.Invariant<
  ExerciseIsAssignedToCategoryConfigType,
  ExerciseIsAssignedToCategoryPassedConfigType
> {
  passes(config: ExerciseIsAssignedToCategoryConfigType) {
    return config.assignment !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.is.assigned.to.category";
  error = ExerciseIsAssignedToCategoryError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseIsAssignedToCategory = new ExerciseIsAssignedToCategoryFactory();
