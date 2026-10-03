import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanHasNoEmptySectionsError extends Error {}

type PlanHasNoEmptySectionsConfigType = {
  planSections: ReadonlyArray<{
    exerciseInstructions: ReadonlyArray<Pick<VO.ExerciseInstructionType, "id">>;
  }>;
};

class PlanHasNoEmptySectionsFactory extends bg.Invariant<PlanHasNoEmptySectionsConfigType> {
  passes(config: PlanHasNoEmptySectionsConfigType) {
    return config.planSections.every((section) => section.exerciseInstructions.length > 0);
  }

  // Stryker disable next-line StringLiteral
  message = "plan.has.no.empty.sections";
  error = PlanHasNoEmptySectionsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanHasNoEmptySections = new PlanHasNoEmptySectionsFactory();
