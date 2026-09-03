import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { PlanSectionLimitForPlanMax } from "+plans/value-objects";

class PlanSectionLimitForPlanError extends Error {}

type PlanSectionLimitForPlanConfigType = { count: tools.IntegerNonNegativeType };

class PlanSectionLimitForPlanFactory extends bg.Invariant<PlanSectionLimitForPlanConfigType> {
  passes(config: PlanSectionLimitForPlanConfigType) {
    return config.count < PlanSectionLimitForPlanMax;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.limit.for.plan";
  error = PlanSectionLimitForPlanError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionLimitForPlan = new PlanSectionLimitForPlanFactory();
