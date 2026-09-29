import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartNameHasChangedError extends Error {}

type BodyPartNameHasChangedConfigType = { current: VO.BodyPartNameType; incoming: VO.BodyPartNameType };

class BodyPartNameHasChangedFactory extends bg.Invariant<BodyPartNameHasChangedConfigType> {
  passes(config: BodyPartNameHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.name.has.changed";
  error = BodyPartNameHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartNameHasChanged = new BodyPartNameHasChangedFactory();
