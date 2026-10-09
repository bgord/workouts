import * as bg from "@bgord/bun";
import type * as VO from "+exercises/value-objects";

class ExerciseCategoryRoleHasChangedError extends Error {}

type ExerciseCategoryRoleHasChangedConfigType = {
  current: VO.ExerciseCategoryRoleType;
  incoming: VO.ExerciseCategoryRoleType;
};

class ExerciseCategoryRoleHasChangedFactory extends bg.Invariant<ExerciseCategoryRoleHasChangedConfigType> {
  passes(config: ExerciseCategoryRoleHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.category.role.has.changed";
  error = ExerciseCategoryRoleHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseCategoryRoleHasChanged = new ExerciseCategoryRoleHasChangedFactory();
