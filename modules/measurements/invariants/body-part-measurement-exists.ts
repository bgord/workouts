import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartMeasurementExistsError extends Error {}
class BodyPartMeasurementExistsFactory extends bg.Invariant<{ measurement: VO.BodyPartMeasurement | null }> {
  passes(config: { measurement: VO.BodyPartMeasurement | null }) {
    return config.measurement !== null;
  }

  message = "body.part.measurement.exists";
  error = BodyPartMeasurementExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const BodyPartMeasurementExists = new BodyPartMeasurementExistsFactory();
