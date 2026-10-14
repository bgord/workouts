import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseCategoryExistsError extends Error {}

type ExerciseCategoryExistsConfigType = { exerciseCategory: VO.ExerciseCategory | null };
type ExerciseCategoryExistsPassedConfigType = { exerciseCategory: VO.ExerciseCategory };

class ExerciseCategoryExistsFactory extends bg.Invariant<
  ExerciseCategoryExistsConfigType,
  ExerciseCategoryExistsPassedConfigType
> {
  passes(config: ExerciseCategoryExistsConfigType) {
    return config.exerciseCategory !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.category.exists";
  error = ExerciseCategoryExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseCategoryExists = new ExerciseCategoryExistsFactory();
