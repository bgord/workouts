import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartMeasurementExistsError extends Error {}

type BodyPartMeasurementExistsConfigType = { measurement: VO.BodyPartMeasurement | null };

class BodyPartMeasurementExistsFactory extends bg.Invariant<BodyPartMeasurementExistsConfigType> {
  passes(config: BodyPartMeasurementExistsConfigType) {
    return config.measurement !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.measurement.exists";
  error = BodyPartMeasurementExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const BodyPartMeasurementExists = new BodyPartMeasurementExistsFactory();
