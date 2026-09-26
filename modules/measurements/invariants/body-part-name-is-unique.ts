import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class BodyPartNameIsUniqueError extends Error {}

type BodyPartNameIsUniqueConfigType = { count: tools.IntegerNonNegativeType };

class BodyPartNameIsUniqueFactory extends bg.Invariant<BodyPartNameIsUniqueConfigType> {
  passes(config: BodyPartNameIsUniqueConfigType) {
    return config.count === 0;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.name.is.unique";
  error = BodyPartNameIsUniqueError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartNameIsUnique = new BodyPartNameIsUniqueFactory();
