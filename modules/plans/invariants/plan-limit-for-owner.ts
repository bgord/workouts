import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class PlanLimitForOwnerError extends Error {}

type PlanLimitForOwnerConfigType = { count: tools.IntegerNonNegativeType };

class PlanLimitForOwnerFactory extends bg.Invariant<PlanLimitForOwnerConfigType> {
  passes(config: PlanLimitForOwnerConfigType) {
    return config.count < 1;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.limit.for.owner";
  error = PlanLimitForOwnerError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanLimitForOwner = new PlanLimitForOwnerFactory();
