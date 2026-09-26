import * as bg from "@bgord/bun";

class BodyPartMeasurementDateIsUniqueError extends Error {}
class BodyPartMeasurementDateIsUniqueFactory extends bg.Invariant<{ count: number }> {
  passes(config: { count: number }) {
    return config.count === 0;
  }

  message = "body.part.measurement.date.is.unique";
  error = BodyPartMeasurementDateIsUniqueError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartMeasurementDateIsUnique = new BodyPartMeasurementDateIsUniqueFactory();
