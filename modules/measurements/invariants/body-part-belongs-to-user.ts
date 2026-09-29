import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class BodyPartBelongsToUserError extends Error {}

type BodyPartBelongsToUserConfigType = {
  userId: Auth.VO.UserIdType;
  requesterId: Auth.VO.UserIdType;
};

class BodyPartBelongsToUserFactory extends bg.Invariant<BodyPartBelongsToUserConfigType> {
  passes(config: BodyPartBelongsToUserConfigType) {
    return config.userId === config.requesterId;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.belongs.to.user";
  error = BodyPartBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartBelongsToUser = new BodyPartBelongsToUserFactory();
