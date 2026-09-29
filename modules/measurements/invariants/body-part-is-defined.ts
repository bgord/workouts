import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class BodyPartIsDefinedError extends Error {}

type BodyPartIsDefinedConfigType = { activeCount: tools.IntegerNonNegativeType };

class BodyPartIsDefinedFactory extends bg.Invariant<BodyPartIsDefinedConfigType> {
  passes(config: BodyPartIsDefinedConfigType) {
    return config.activeCount > 0;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.is.defined";
  error = BodyPartIsDefinedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartIsDefined = new BodyPartIsDefinedFactory();
