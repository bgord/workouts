import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyWeightMeasurementExistsError extends Error {}

type BodyWeightMeasurementExistsConfigType = { measurement: VO.BodyWeightMeasurement | null };
type BodyWeightMeasurementExistsPassedConfigType = { measurement: VO.BodyWeightMeasurement };

class BodyWeightMeasurementExistsFactory extends bg.Invariant<
  BodyWeightMeasurementExistsConfigType,
  BodyWeightMeasurementExistsPassedConfigType
> {
  passes(config: BodyWeightMeasurementExistsConfigType) {
    return config.measurement !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "body.weight.measurement.exists";
  error = BodyWeightMeasurementExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const BodyWeightMeasurementExists = new BodyWeightMeasurementExistsFactory();
