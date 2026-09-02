import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class ExerciseBelongsToUserError extends Error {}

type ExerciseBelongsToUserConfigType = {
  userId: Auth.VO.UserIdType | undefined;
  requesterId: Auth.VO.UserIdType;
};

class ExerciseBelongsToUserFactory extends bg.Invariant<ExerciseBelongsToUserConfigType> {
  passes(config: ExerciseBelongsToUserConfigType) {
    return config.userId === config.requesterId;
  }

  // Stryker disable next-line StringLiteral
  message = "exercise.belongs.to.user";
  error = ExerciseBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const ExerciseBelongsToUser = new ExerciseBelongsToUserFactory();
