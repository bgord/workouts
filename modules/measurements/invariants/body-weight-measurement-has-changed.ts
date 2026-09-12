import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyWeightMeasurementHasChangedError extends Error {}

type BodyWeightMeasurementHasChangedConfigType = {
  current: { weight: VO.BodyWeightType; measuredOn: VO.BodyWeightMeasuredOnType };
  incoming: { weight: VO.BodyWeightType; measuredOn: VO.BodyWeightMeasuredOnType };
};

class BodyWeightMeasurementHasChangedFactory extends bg.Invariant<BodyWeightMeasurementHasChangedConfigType> {
  passes(config: BodyWeightMeasurementHasChangedConfigType) {
    return (
      config.current.weight !== config.incoming.weight ||
      config.current.measuredOn !== config.incoming.measuredOn
    );
  }

  // Stryker disable next-line StringLiteral
  message = "body.weight.measurement.has.changed";
  error = BodyWeightMeasurementHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyWeightMeasurementHasChanged = new BodyWeightMeasurementHasChangedFactory();
