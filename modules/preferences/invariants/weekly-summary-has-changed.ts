import * as bg from "@bgord/bun";
import type * as VO from "+preferences/value-objects";

class WeeklySummaryHasChangedError extends Error {}

type WeeklySummaryHasChangedConfigType = { current: VO.WeeklySummaryType; candidate: VO.WeeklySummaryType };

class WeeklySummaryHasChangedFactory extends bg.Invariant<WeeklySummaryHasChangedConfigType> {
  passes(config: WeeklySummaryHasChangedConfigType) {
    return config.current !== config.candidate;
  }

  // Stryker disable next-line StringLiteral
  message = "weekly.summary.has.changed";
  error = WeeklySummaryHasChangedError;
  kind = bg.InvariantFailureKind.precondition;
}

export const WeeklySummaryHasChanged = new WeeklySummaryHasChangedFactory();
