import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class BodyPartMeasurementBelongsToUserError extends Error {}
class BodyPartMeasurementBelongsToUserFactory extends bg.Invariant<{
  userId: Auth.VO.UserIdType;
  requesterId: Auth.VO.UserIdType;
}> {
  passes(config: { userId: Auth.VO.UserIdType; requesterId: Auth.VO.UserIdType }) {
    return config.userId === config.requesterId;
  }

  message = "body.part.measurement.belongs.to.user";
  error = BodyPartMeasurementBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartMeasurementBelongsToUser = new BodyPartMeasurementBelongsToUserFactory();
