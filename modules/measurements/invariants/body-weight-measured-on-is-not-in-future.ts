import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as VO from "+measurements/value-objects";

class BodyWeightMeasuredOnIsNotInFutureError extends Error {}

type BodyWeightMeasuredOnIsNotInFutureConfigType = {
  measuredOn: VO.BodyWeightMeasuredOnType;
  today: tools.DayIsoIdType;
};

class BodyWeightMeasuredOnIsNotInFutureFactory extends bg.Invariant<BodyWeightMeasuredOnIsNotInFutureConfigType> {
  passes(config: BodyWeightMeasuredOnIsNotInFutureConfigType) {
    return config.measuredOn <= config.today;
  }

  // Stryker disable next-line StringLiteral
  message = "body.weight.measured.on.is.not.in.future";
  error = BodyWeightMeasuredOnIsNotInFutureError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyWeightMeasuredOnIsNotInFuture = new BodyWeightMeasuredOnIsNotInFutureFactory();
