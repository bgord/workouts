import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";

class PlanNameIsUniqueForOwnerError extends Error {}

type PlanNameIsUniqueForOwnerConfigType = { count: tools.IntegerNonNegativeType };

class PlanNameIsUniqueForOwnerFactory extends bg.Invariant<PlanNameIsUniqueForOwnerConfigType> {
  passes(config: PlanNameIsUniqueForOwnerConfigType) {
    return config.count === 0;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.name.is.unique.for.owner";
  error = PlanNameIsUniqueForOwnerError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanNameIsUniqueForOwner = new PlanNameIsUniqueForOwnerFactory();
