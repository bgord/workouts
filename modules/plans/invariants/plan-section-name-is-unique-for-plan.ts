import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionNameIsUniqueForPlanError extends Error {}

type PlanSectionNameLimitForPlanConfigType = {
  planSectionName: VO.PlanSectionNameType;
  planSections: Array<VO.PlanSection>;
};

class PlanSectionNameIsUniqueForPlanFactory extends bg.Invariant<PlanSectionNameLimitForPlanConfigType> {
  passes(config: PlanSectionNameLimitForPlanConfigType) {
    return !config.planSections.find((section) => section.name === config.planSectionName);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.name.is.unique.for.plan";
  error = PlanSectionNameIsUniqueForPlanError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionNameIsUniqueForPlan = new PlanSectionNameIsUniqueForPlanFactory();
