import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class BodyPartHasChangedError extends Error {}
class BodyPartHasChangedFactory extends bg.Invariant<{
  current: VO.BodyPartNameType;
  incoming: VO.BodyPartNameType;
}> {
  passes(config: { current: VO.BodyPartNameType; incoming: VO.BodyPartNameType }) {
    return config.current !== config.incoming;
  }

  message = "body.part.has.changed";
  error = BodyPartHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartHasChanged = new BodyPartHasChangedFactory();
