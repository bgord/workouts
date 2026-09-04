import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanIsRemovableError extends Error {}

type PlanIsRemovableConfigType = { status: VO.PlanStatusEnum };

class PlanIsRemovableFactory extends bg.Invariant<PlanIsRemovableConfigType> {
  passes(config: PlanIsRemovableConfigType) {
    return [VO.PlanStatusEnum.draft, VO.PlanStatusEnum.archived].includes(config.status);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.is.removable";
  error = PlanIsRemovableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanIsRemovable = new PlanIsRemovableFactory();
