import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyWeightReferenceHasChangedError extends Error {}

type BodyWeightReferenceHasChangedConfigType = {
  measurement: VO.BodyWeightMeasurement;
  goal: VO.BodyWeightGoalType;
};

class BodyWeightReferenceHasChangedFactory extends bg.Invariant<BodyWeightReferenceHasChangedConfigType> {
  passes(config: BodyWeightReferenceHasChangedConfigType) {
    return !config.measurement.reference || config.measurement.goal !== config.goal;
  }

  // Stryker disable next-line StringLiteral
  message = "body.weight.reference.has.changed";
  error = BodyWeightReferenceHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyWeightReferenceHasChanged = new BodyWeightReferenceHasChangedFactory();
