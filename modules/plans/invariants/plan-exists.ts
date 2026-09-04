import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanExistsError extends Error {}

type PlanExistsConfigType = { status: VO.PlanStatusEnum };

class PlanExistsFactory extends bg.Invariant<PlanExistsConfigType> {
  passes(config: PlanExistsConfigType) {
    return ![VO.PlanStatusEnum.initial, VO.PlanStatusEnum.removed].includes(config.status);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.exists";
  error = PlanExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const PlanExists = new PlanExistsFactory();
