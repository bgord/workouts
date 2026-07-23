import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanIsRestorableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanIsRestorableError.prototype);
  }
}

type PlanIsRestorableConfigType = { status: VO.PlanStatusEnum };

class PlanIsRestorableFactory extends bg.Invariant<PlanIsRestorableConfigType> {
  passes(config: PlanIsRestorableConfigType) {
    return VO.PlanStatusEnum.archived === config.status;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.is.restorable";
  error = PlanIsRestorableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanIsRestorable = new PlanIsRestorableFactory();
