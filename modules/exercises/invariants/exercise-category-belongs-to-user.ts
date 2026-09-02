import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class ExerciseCategoryBelongsToUserError extends Error {}

type ExerciseCategoryBelongsToUserConfigType = {
  userId: Auth.VO.UserIdType | undefined;
  requesterId: Auth.VO.UserIdType;
};

class ExerciseCategoryBelongsToUserFactory extends bg.Invariant<ExerciseCategoryBelongsToUserConfigType> {
  passes(config: ExerciseCategoryBelongsToUserConfigType) {
    return config.userId === config.requesterId;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.category.belongs.to.user";
  error = ExerciseCategoryBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseCategoryBelongsToUser = new ExerciseCategoryBelongsToUserFactory();
