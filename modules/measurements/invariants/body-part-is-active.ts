import * as bg from "@bgord/bun";

class BodyPartIsActiveError extends Error {}
class BodyPartIsActiveFactory extends bg.Invariant<{ archived: boolean }> {
  passes(config: { archived: boolean }) {
    return !config.archived;
  }

  message = "body.part.is.active";
  error = BodyPartIsActiveError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartIsActive = new BodyPartIsActiveFactory();
