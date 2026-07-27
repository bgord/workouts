import * as bg from "@bgord/bun";
import type * as VO from "+plans/value-objects";

class PlanNameHasChangedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, PlanNameHasChangedError.prototype);
  }
}

type PlanNameHasChangedConfigType = { current: VO.PlanNameType | undefined; incoming: VO.PlanNameType };

class PlanNameHasChangedFactory extends bg.Invariant<PlanNameHasChangedConfigType> {
  passes(config: PlanNameHasChangedConfigType) {
    return config.current !== config.incoming;
  }

  // Stryker disable next-line StringLiteral
  message = "plan.name.has.changed";
  error = PlanNameHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const PlanNameHasChanged = new PlanNameHasChangedFactory();
