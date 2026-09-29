import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class BodyPartIsActiveError extends Error {}

type BodyPartIsActiveConfigType = { archivedAt: tools.TimestampValueType | null };

class BodyPartIsActiveFactory extends bg.Invariant<BodyPartIsActiveConfigType> {
  passes(config: BodyPartIsActiveConfigType) {
    return config.archivedAt === null;
  }

  // Stryker disable next-line StringLiteral
  message = "body.part.is.active";
  error = BodyPartIsActiveError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const BodyPartIsActive = new BodyPartIsActiveFactory();
