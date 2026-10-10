import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartDescriptionHasChangedError extends Error {}

type BodyPartDescriptionHasChangedConfigType = {
  current: VO.BodyPartDescriptionType | null;
  incoming: VO.BodyPartDescriptionType | undefined;
};

class BodyPartDescriptionHasChangedFactory extends bg.Invariant<BodyPartDescriptionHasChangedConfigType> {
  passes(config: BodyPartDescriptionHasChangedConfigType) {
    return (config.current ?? undefined) !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.description.has.changed";
  error = BodyPartDescriptionHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartDescriptionHasChanged = new BodyPartDescriptionHasChangedFactory();
