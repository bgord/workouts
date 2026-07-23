import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanIsArchivableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanIsArchivableError.prototype);
  }
}

type PlanIsArchivableConfigType = { status: VO.PlanStatusEnum };

class PlanIsArchivableFactory extends bg.Invariant<PlanIsArchivableConfigType> {
  passes(config: PlanIsArchivableConfigType) {
    return [VO.PlanStatusEnum.draft, VO.PlanStatusEnum.finalized].includes(config.status);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.is.archivable";
  error = PlanIsArchivableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanIsArchivable = new PlanIsArchivableFactory();
