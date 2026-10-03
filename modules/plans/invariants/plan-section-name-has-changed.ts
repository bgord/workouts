import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionNameHasChangedError extends Error {}

type PlanSectionNameHasChangedConfigType = {
  current: VO.PlanSectionNameType | undefined;
  incoming: VO.PlanSectionNameType;
};

class PlanSectionNameHasChangedFactory extends bg.Invariant<PlanSectionNameHasChangedConfigType> {
  passes(config: PlanSectionNameHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.name.has.changed";
  error = PlanSectionNameHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionNameHasChanged = new PlanSectionNameHasChangedFactory();
