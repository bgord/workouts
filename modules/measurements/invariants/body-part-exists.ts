import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartExistsError extends Error {}

type BodyPartExistsConfigType = { bodyPart: VO.BodyPart | null };
type BodyPartExistsPassedConfigType = { bodyPart: VO.BodyPart };

class BodyPartExistsFactory extends bg.Invariant<BodyPartExistsConfigType, BodyPartExistsPassedConfigType> {
  passes(config: BodyPartExistsConfigType) {
    return config.bodyPart !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.exists";
  error = BodyPartExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const BodyPartExists = new BodyPartExistsFactory();
