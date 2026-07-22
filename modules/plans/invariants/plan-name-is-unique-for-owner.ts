import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class PlanNameIsUniquePerUserError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanNameIsUniquePerUserError.prototype);
  }
}

type PlanNameIsUniquePerUserConfigType = { count: tools.IntegerNonNegativeType };

class PlanNameIsUniquePerUserFactory extends bg.Invariant<PlanNameIsUniquePerUserConfigType> {
  passes(config: PlanNameIsUniquePerUserConfigType) {
    return config.count === 0;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.name.is.unique.per.user";
  error = PlanNameIsUniquePerUserError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanNameIsUniquePerUser = new PlanNameIsUniquePerUserFactory();
