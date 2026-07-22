import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanSectionExistsError.prototype);
  }
}

type PlanSectionExistsConfigType = {
  planSectionId: VO.PlanSectionIdType;
  planSections: Array<VO.PlanSection>;
};

class PlanSectionExistsFactory extends bg.Invariant<PlanSectionExistsConfigType> {
  passes(config: PlanSectionExistsConfigType) {
    return config.planSections.some((section) => section.id === config.planSectionId);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exists";
  error = PlanSectionExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExists = new PlanSectionExistsFactory();
