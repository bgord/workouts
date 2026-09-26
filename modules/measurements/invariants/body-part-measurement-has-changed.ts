import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartMeasurementHasChangedError extends Error {}
class BodyPartMeasurementHasChangedFactory extends bg.Invariant<{
  current: { valueMm: VO.BodyPartMeasurementValueType; measuredOn: VO.BodyPartMeasuredOnType };
  incoming: { valueMm: VO.BodyPartMeasurementValueType; measuredOn: VO.BodyPartMeasuredOnType };
}> {
  passes(config: {
    current: { valueMm: VO.BodyPartMeasurementValueType; measuredOn: VO.BodyPartMeasuredOnType };
    incoming: { valueMm: VO.BodyPartMeasurementValueType; measuredOn: VO.BodyPartMeasuredOnType };
  }) {
    return (
      config.current.valueMm !== config.incoming.valueMm ||
      config.current.measuredOn !== config.incoming.measuredOn
    );
  }

  message = "body.part.measurement.has.changed";
  error = BodyPartMeasurementHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartMeasurementHasChanged = new BodyPartMeasurementHasChangedFactory();
