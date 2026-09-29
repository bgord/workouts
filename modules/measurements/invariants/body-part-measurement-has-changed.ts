import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartMeasurementHasChangedError extends Error {}

type BodyPartMeasurementHasChangedConfigType = {
  current: {
    bodyPartId: VO.BodyPartIdType;
    value: VO.BodyPartCircumferenceType;
    measuredOn: VO.BodyPartMeasuredOnType;
  };
  incoming: {
    bodyPartId: VO.BodyPartIdType;
    value: VO.BodyPartCircumferenceType;
    measuredOn: VO.BodyPartMeasuredOnType;
  };
};

class BodyPartMeasurementHasChangedFactory extends bg.Invariant<BodyPartMeasurementHasChangedConfigType> {
  passes(config: BodyPartMeasurementHasChangedConfigType) {
    return (
      config.current.bodyPartId !== config.incoming.bodyPartId ||
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
