import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartLimitError extends Error {}

type BodyPartLimitConfigType = { bodyParts: ReadonlyArray<VO.BodyPart> };

class BodyPartLimitFactory extends bg.Invariant<BodyPartLimitConfigType> {
  passes(config: BodyPartLimitConfigType) {
    return config.bodyParts.length < 20;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.limit";
  error = BodyPartLimitError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartLimit = new BodyPartLimitFactory();
