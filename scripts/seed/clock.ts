import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";

export const now = new bg.ClockSystemAdapter().now();

export const Clock = new bg.ClockFixedAdapter(now.subtract(tools.Duration.Weeks(9)));

export function moveClockTo(timestamp: tools.Timestamp) {
  if (timestamp.isBefore(Clock.now())) throw new Error("Seed clock cannot move backwards");

  Clock.advanceBy(timestamp.difference(Clock.now()));
}

export function advanceClockBy(duration: tools.Duration) {
  Clock.advanceBy(duration);
}
