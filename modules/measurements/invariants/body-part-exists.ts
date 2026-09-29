import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartExistsError extends Error {}

type BodyPartExistsConfigType = { bodyPart: VO.BodyPart | null };

class BodyPartExistsFactory extends bg.Invariant<BodyPartExistsConfigType> {
  passes(config: BodyPartExistsConfigType) {
    return config.bodyPart !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.exists";
  error = BodyPartExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const BodyPartExists = new BodyPartExistsFactory();
