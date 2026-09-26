import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartMeasurementHasChangedError extends Error {}

type BodyPartMeasurementHasChangedConfigType = {
  current: { value: VO.BodyPartMeasurementValueType; measuredOn: VO.BodyPartMeasuredOnType };
  incoming: { value: VO.BodyPartMeasurementValueType; measuredOn: VO.BodyPartMeasuredOnType };
};

class BodyPartMeasurementHasChangedFactory extends bg.Invariant<BodyPartMeasurementHasChangedConfigType> {
  passes(config: BodyPartMeasurementHasChangedConfigType) {
    return (
      config.current.value !== config.incoming.value ||
      config.current.measuredOn !== config.incoming.measuredOn
    );
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.measurement.has.changed";
  error = BodyPartMeasurementHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartMeasurementHasChanged = new BodyPartMeasurementHasChangedFactory();
