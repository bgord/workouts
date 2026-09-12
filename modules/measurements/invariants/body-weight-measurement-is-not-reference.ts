import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyWeightMeasurementIsNotReferenceError extends Error {}

type BodyWeightMeasurementIsNotReferenceConfigType = { measurement: VO.BodyWeightMeasurement };

class BodyWeightMeasurementIsNotReferenceFactory extends bg.Invariant<BodyWeightMeasurementIsNotReferenceConfigType> {
  passes(config: BodyWeightMeasurementIsNotReferenceConfigType) {
    return !config.measurement.reference;
  }

  // Stryker disable next-line StringLiteral
  message = "body.weight.measurement.is.not.reference";
  error = BodyWeightMeasurementIsNotReferenceError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyWeightMeasurementIsNotReference = new BodyWeightMeasurementIsNotReferenceFactory();
