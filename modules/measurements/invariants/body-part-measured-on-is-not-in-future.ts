import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as VO from "+measurements/value-objects";

class BodyPartMeasuredOnIsNotInFutureError extends Error {}

type BodyPartMeasuredOnIsNotInFutureConfigType = {
  measuredOn: VO.BodyPartMeasuredOnType;
  today: tools.DayIsoIdType;
};

class BodyPartMeasuredOnIsNotInFutureFactory extends bg.Invariant<BodyPartMeasuredOnIsNotInFutureConfigType> {
  passes(config: BodyPartMeasuredOnIsNotInFutureConfigType) {
    return config.measuredOn <= config.today;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.measured.on.is.not.in.future";
  error = BodyPartMeasuredOnIsNotInFutureError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartMeasuredOnIsNotInFuture = new BodyPartMeasuredOnIsNotInFutureFactory();
