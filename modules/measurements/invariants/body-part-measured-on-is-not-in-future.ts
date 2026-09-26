import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as VO from "+measurements/value-objects";

class BodyPartMeasuredOnIsNotInFutureError extends Error {}
class BodyPartMeasuredOnIsNotInFutureFactory extends bg.Invariant<{
  measuredOn: VO.BodyPartMeasuredOnType;
  today: tools.DayIsoIdType;
}> {
  passes(config: { measuredOn: VO.BodyPartMeasuredOnType; today: tools.DayIsoIdType }) {
    return config.measuredOn <= config.today;
  }

  message = "body.part.measured.on.is.not.in.future";
  error = BodyPartMeasuredOnIsNotInFutureError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartMeasuredOnIsNotInFuture = new BodyPartMeasuredOnIsNotInFutureFactory();
