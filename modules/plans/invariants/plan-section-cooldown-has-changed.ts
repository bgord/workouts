import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionCooldownHasChangedError extends Error {}

type PlanSectionCooldownHasChangedConfigType = {
  current: VO.PlanSectionCooldownType | undefined;
  incoming: VO.PlanSectionCooldownType | undefined;
};

class PlanSectionCooldownHasChangedFactory extends bg.Invariant<PlanSectionCooldownHasChangedConfigType> {
  passes(config: PlanSectionCooldownHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.cooldown.has.changed";
  error = PlanSectionCooldownHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionCooldownHasChanged = new PlanSectionCooldownHasChangedFactory();
