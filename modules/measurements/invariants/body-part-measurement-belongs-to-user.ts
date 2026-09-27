import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class BodyPartMeasurementBelongsToUserError extends Error {}

type BodyPartMeasurementBelongsToUserConfigType = {
  userId: Auth.VO.UserIdType;
  requesterId: Auth.VO.UserIdType;
};

class BodyPartMeasurementBelongsToUserFactory extends bg.Invariant<BodyPartMeasurementBelongsToUserConfigType> {
  passes(config: BodyPartMeasurementBelongsToUserConfigType) {
    return config.userId === config.requesterId;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.measurement.belongs.to.user";
  error = BodyPartMeasurementBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartMeasurementBelongsToUser = new BodyPartMeasurementBelongsToUserFactory();
