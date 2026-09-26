import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class BodyPartBelongsToUserError extends Error {}
class BodyPartBelongsToUserFactory extends bg.Invariant<{
  userId: Auth.VO.UserIdType;
  requesterId: Auth.VO.UserIdType;
}> {
  passes(config: { userId: Auth.VO.UserIdType; requesterId: Auth.VO.UserIdType }) {
    return config.userId === config.requesterId;
  }

  message = "body.part.belongs.to.user";
  error = BodyPartBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartBelongsToUser = new BodyPartBelongsToUserFactory();
