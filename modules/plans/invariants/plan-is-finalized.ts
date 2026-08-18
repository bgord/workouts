import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanIsFinalizedError extends Error {}

type PlanIsFinalizedConfigType = { status: VO.PlanStatusEnum };

class PlanIsFinalizedFactory extends bg.Invariant<PlanIsFinalizedConfigType> {
  passes(config: PlanIsFinalizedConfigType) {
    return config.status === VO.PlanStatusEnum.finalized;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.is.finalized";
  error = PlanIsFinalizedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanIsFinalized = new PlanIsFinalizedFactory();
