import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanSectionWarmupHasChangedError extends Error {}

type PlanSectionWarmupHasChangedConfigType = {
  current: VO.PlanSectionWarmupType | undefined;
  incoming: VO.PlanSectionWarmupType | undefined;
};

class PlanSectionWarmupHasChangedFactory extends bg.Invariant<PlanSectionWarmupHasChangedConfigType> {
  passes(config: PlanSectionWarmupHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.section.warmup.has.changed";
  error = PlanSectionWarmupHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanSectionWarmupHasChanged = new PlanSectionWarmupHasChangedFactory();
