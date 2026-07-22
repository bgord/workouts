import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class PlanLimitForOwnerError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanLimitForOwnerError.prototype);
  }
}

type PlanLimitForOwnerConfigType = { count: tools.IntegerNonNegativeType };

class PlanLimitForOwnerFactory extends bg.Invariant<PlanLimitForOwnerConfigType> {
  passes(config: PlanLimitForOwnerConfigType) {
    return config.count <= 2;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.limit.for.owner";
  error = PlanLimitForOwnerError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanLimitForOwner = new PlanLimitForOwnerFactory();
