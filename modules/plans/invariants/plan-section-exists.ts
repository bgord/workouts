import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionExistsError extends Error {}

type PlanSectionExistsConfigType = { section: Pick<VO.PlanSection, "id"> | undefined };
type PlanSectionExistsPassedConfigType = { section: Pick<VO.PlanSection, "id"> };

class PlanSectionExistsFactory extends bg.Invariant<
  PlanSectionExistsConfigType,
  PlanSectionExistsPassedConfigType
> {
  passes(config: PlanSectionExistsConfigType) {
    return config.section !== undefined;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.exists";
  error = PlanSectionExistsError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionExists = new PlanSectionExistsFactory();
