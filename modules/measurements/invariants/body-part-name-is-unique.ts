import * as bg from "@bgord/bun";

class BodyPartNameIsUniqueError extends Error {}
class BodyPartNameIsUniqueFactory extends bg.Invariant<{ count: number }> {
  passes(config: { count: number }) {
    return config.count === 0;
  }

  message = "body.part.name.is.unique";
  error = BodyPartNameIsUniqueError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartNameIsUnique = new BodyPartNameIsUniqueFactory();
