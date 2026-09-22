import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

class WeeklySummaryScheduleError extends Error {}

type WeeklySummaryScheduleConfigType = { timestamp: tools.TimestampValueType };

class WeeklySummaryScheduleFactory extends bg.Invariant<WeeklySummaryScheduleConfigType> {
  passes(config: WeeklySummaryScheduleConfigType) {
    if (!tools.Weekday.fromTimestampValue(config.timestamp).isMonday()) return false;

    const sixAM = tools.Hour.fromNumber(6);
    const hour = tools.Hour.fromTimestampValue(config.timestamp);

    return hour.equals(sixAM);
  }

  // Stryker disable next-line StringLiteral
  message = "weekly.summary.schedule";
  error = WeeklySummaryScheduleError;
  kind = bg.InvariantFailureKind.forbidden;
}

export const WeeklySummarySchedule = new WeeklySummaryScheduleFactory();
