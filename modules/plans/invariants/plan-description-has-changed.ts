import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanDescriptionHasChangedError extends Error {}

type PlanDescriptionHasChangedConfigType = {
  current: VO.PlanDescriptionType | undefined;
  incoming: VO.PlanDescriptionType | undefined;
};

class PlanDescriptionHasChangedFactory extends bg.Invariant<PlanDescriptionHasChangedConfigType> {
  passes(config: PlanDescriptionHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.description.has.changed";
  error = PlanDescriptionHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanDescriptionHasChanged = new PlanDescriptionHasChangedFactory();
