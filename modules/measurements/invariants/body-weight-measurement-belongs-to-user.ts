import * as bg from "@bgord/bun";
import type * as Auth from "+auth";

class BodyWeightMeasurementBelongsToUserError extends Error {}

type BodyWeightMeasurementBelongsToUserConfigType = {
  userId: Auth.VO.UserIdType;
  requesterId: Auth.VO.UserIdType;
};

class BodyWeightMeasurementBelongsToUserFactory extends bg.Invariant<BodyWeightMeasurementBelongsToUserConfigType> {
  passes(config: BodyWeightMeasurementBelongsToUserConfigType) {
    return config.userId === config.requesterId;
  }

  // Stryker disable next-line StringLiteral
  message = "body.weight.measurement.belongs.to.user";
  error = BodyWeightMeasurementBelongsToUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyWeightMeasurementBelongsToUser = new BodyWeightMeasurementBelongsToUserFactory();
