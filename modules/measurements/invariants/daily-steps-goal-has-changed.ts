import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class DailyStepsGoalHasChangedError extends Error {}

type DailyStepsGoalHasChangedConfigType = {
  current: VO.DailyStepsGoalType | null;
  goal: VO.DailyStepsGoalType;
};

class DailyStepsGoalHasChangedFactory extends bg.Invariant<DailyStepsGoalHasChangedConfigType> {
  passes(config: DailyStepsGoalHasChangedConfigType) {
    return config.current !== config.goal;
  }

  // Stryker disable next-line StringLiteral
  message = "daily.steps.goal.has.changed";
  error = DailyStepsGoalHasChangedError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const DailyStepsGoalHasChanged = new DailyStepsGoalHasChangedFactory();
