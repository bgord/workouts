import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartExistsError extends Error {}
class BodyPartExistsFactory extends bg.Invariant<{ bodyPart: VO.BodyPart | null }> {
  passes(config: { bodyPart: VO.BodyPart | null }) {
    return config.bodyPart !== null;
  }

  message = "body.part.exists";
  error = BodyPartExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const BodyPartExists = new BodyPartExistsFactory();
