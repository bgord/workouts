import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Notifications from "+notifications";

const at = (iso: string) => ({ timestamp: tools.Timestamp.fromInstant(Temporal.Instant.from(iso)).ms });

describe("WeeklySummarySchedule", () => {
  test("passes - monday 06:00 UTC", () => {
    expect(Notifications.Invariants.WeeklySummarySchedule.passes(at("2025-01-06T06:00:00Z"))).toEqual(true);
  });

  test("passes - monday 06:59 UTC", () => {
    expect(Notifications.Invariants.WeeklySummarySchedule.passes(at("2025-01-06T06:59:00Z"))).toEqual(true);
  });

  test("fails - monday 05:00 UTC", () => {
    expect(Notifications.Invariants.WeeklySummarySchedule.passes(at("2025-01-06T05:00:00Z"))).toEqual(false);
  });

  test("fails - monday 07:00 UTC", () => {
    expect(Notifications.Invariants.WeeklySummarySchedule.passes(at("2025-01-06T07:00:00Z"))).toEqual(false);
  });

  test("fails - tuesday 06:00 UTC", () => {
    expect(Notifications.Invariants.WeeklySummarySchedule.passes(at("2025-01-07T06:00:00Z"))).toEqual(false);
  });

  test("fails - sunday 06:00 UTC", () => {
    expect(Notifications.Invariants.WeeklySummarySchedule.passes(at("2025-01-05T06:00:00Z"))).toEqual(false);
  });

  test("enforce - throws", () => {
    expect(() => Notifications.Invariants.WeeklySummarySchedule.enforce(at("2025-01-07T06:00:00Z"))).toThrow(
      Notifications.Invariants.WeeklySummarySchedule.error,
    );
  });
});
