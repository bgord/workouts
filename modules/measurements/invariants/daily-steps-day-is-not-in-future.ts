import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import type * as VO from "+measurements/value-objects";

class DailyStepsDayIsNotInFutureError extends Error {}

type DailyStepsDayIsNotInFutureConfigType = {
  day: VO.StepsDayType;
  today: tools.DayIsoIdType;
};

class DailyStepsDayIsNotInFutureFactory extends bg.Invariant<DailyStepsDayIsNotInFutureConfigType> {
  passes(config: DailyStepsDayIsNotInFutureConfigType) {
    return config.day <= config.today;
  }

  // Stryker disable next-line StringLiteral
  message = "daily.steps.day.is.not.in.future";
  error = DailyStepsDayIsNotInFutureError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const DailyStepsDayIsNotInFuture = new DailyStepsDayIsNotInFutureFactory();
