import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanHasSectionsError extends Error {}

type PlanHasSectionsConfigType = { planSections: Array<VO.PlanSection> };

class PlanHasSectionsFactory extends bg.Invariant<PlanHasSectionsConfigType> {
  passes(config: PlanHasSectionsConfigType) {
    return config.planSections.length > 0;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.has.sections";
  error = PlanHasSectionsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanHasSections = new PlanHasSectionsFactory();
