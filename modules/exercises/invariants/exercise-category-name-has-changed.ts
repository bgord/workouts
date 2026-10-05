import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseCategoryNameHasChangedError extends Error {}

type ExerciseCategoryNameHasChangedConfigType = {
  current: VO.ExerciseCategoryNameType;
  incoming: VO.ExerciseCategoryNameType;
};

class ExerciseCategoryNameHasChangedFactory extends bg.Invariant<ExerciseCategoryNameHasChangedConfigType> {
  passes(config: ExerciseCategoryNameHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.category.name.has.changed";
  error = ExerciseCategoryNameHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseCategoryNameHasChanged = new ExerciseCategoryNameHasChangedFactory();
