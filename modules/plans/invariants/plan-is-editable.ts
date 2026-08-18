import * as bg from "@bgord/bun";
import * as VO from "+plans/value-objects";

class PlanIsEditableError extends Error {}

type PlanIsEditableConfigType = { status: VO.PlanStatusEnum };

class PlanIsEditableFactory extends bg.Invariant<PlanIsEditableConfigType> {
  passes(config: PlanIsEditableConfigType) {
    return config.status === VO.PlanStatusEnum.draft;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.is.editable";
  error = PlanIsEditableError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanIsEditable = new PlanIsEditableFactory();
