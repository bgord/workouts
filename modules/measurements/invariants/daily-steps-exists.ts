import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

class DailyStepsExistsError extends Error {}

type DailyStepsExistsConfigType = { dailySteps: VO.DailySteps | null };

class DailyStepsExistsFactory extends bg.Invariant<DailyStepsExistsConfigType> {
  passes(config: DailyStepsExistsConfigType) {
    return config.dailySteps !== null;
  }

  // Stryker disable next-line StringLiteral
  message = "daily.steps.exists";
  error = DailyStepsExistsError;
  kind = bg.InvariantFailureKind.not_found;
}

export const DailyStepsExists = new DailyStepsExistsFactory();
