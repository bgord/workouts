import { describe, expect, test } from "bun:test";
import { DateFormat } from "../web/services/date-format";

const today = "2026-10-07";
const now = 1791374400000;

describe("DateFormat", () => {
  test("full", () => {
    const result = DateFormat.full("en", "2026-10-07");

    expect(result).toEqual("Oct 7, 2026");
  });

  test("full - pl", () => {
    const result = DateFormat.full("pl", "2026-10-07");

    expect(result).toEqual("7 paź 2026");
  });

  test("short", () => {
    const result = DateFormat.short("en", "2026-09-12", today);

    expect(result).toEqual("Sep 12");
  });

  test("short - another year", () => {
    const result = DateFormat.short("en", "2025-09-12", today);

    expect(result).toEqual("Sep 12, 2025");
  });

  test("short - pl", () => {
    const result = DateFormat.short("pl", "2026-09-12", today);

    expect(result).toEqual("12 wrz");
  });

  test("list", () => {
    const result = DateFormat.list("en", "2026-10-07", today);

    expect(result).toEqual("Wed, Oct 7");
  });

  test("list - another year", () => {
    const result = DateFormat.list("en", "2025-10-07", today);

    expect(result).toEqual("Tue, Oct 7, 2025");
  });

  test("list - pl", () => {
    const result = DateFormat.list("pl", "2026-10-07", today);

    expect(result).toEqual("śr., 7 paź");
  });

  test("dayLabel - yesterday", () => {
    const result = DateFormat.dayLabel("en", "2026-10-06", today);

    expect(result).toEqual("Yesterday");
  });

  test("dayLabel - today", () => {
    const result = DateFormat.dayLabel("en", "2026-10-07", today);

    expect(result).toEqual("Today");
  });

  test("dayLabel - tomorrow", () => {
    const result = DateFormat.dayLabel("en", "2026-10-08", today);

    expect(result).toEqual("Tomorrow");
  });

  test("dayLabel - in two days", () => {
    const result = DateFormat.dayLabel("en", "2026-10-09", today);

    expect(result).toEqual("Fri, Oct 9");
  });

  test("dayLabel - two days ago", () => {
    const result = DateFormat.dayLabel("en", "2026-10-05", today);

    expect(result).toEqual("Mon, Oct 5");
  });

  test("dayLabel - another year", () => {
    const result = DateFormat.dayLabel("en", "2025-10-09", today);

    expect(result).toEqual("Thu, Oct 9, 2025");
  });

  test("dayLabel - pl", () => {
    const result = DateFormat.dayLabel("pl", "2026-10-07", today);

    expect(result).toEqual("Dzisiaj");
  });

  test("freshness - today", () => {
    const result = DateFormat.freshness("en", "2026-10-07", today);

    expect(result).toEqual("today");
  });

  test("freshness - yesterday", () => {
    const result = DateFormat.freshness("en", "2026-10-06", today);

    expect(result).toEqual("yesterday");
  });

  test("freshness - 6 days", () => {
    const result = DateFormat.freshness("en", "2026-10-01", today);

    expect(result).toEqual("6 days ago");
  });

  test("freshness - 7 days", () => {
    const result = DateFormat.freshness("en", "2026-09-30", today);

    expect(result).toEqual("last week");
  });

  test("freshness - 10 days", () => {
    const result = DateFormat.freshness("en", "2026-09-27", today);

    expect(result).toEqual("last week");
  });

  test("freshness - 11 days", () => {
    const result = DateFormat.freshness("en", "2026-09-26", today);

    expect(result).toEqual("2 weeks ago");
  });

  test("freshness - 34 days", () => {
    const result = DateFormat.freshness("en", "2026-09-03", today);

    expect(result).toEqual("5 weeks ago");
  });

  test("freshness - 35 days", () => {
    const result = DateFormat.freshness("en", "2026-09-02", today);

    expect(result).toEqual("last month");
  });

  test("freshness - 11 months", () => {
    const result = DateFormat.freshness("en", "2025-11-30", today);

    expect(result).toEqual("11 months ago");
  });

  test("freshness - 12 months", () => {
    const result = DateFormat.freshness("en", "2025-10-07", today);

    expect(result).toEqual("last year");
  });

  test("freshness - 2 years", () => {
    const result = DateFormat.freshness("en", "2024-10-07", today);

    expect(result).toEqual("2 years ago");
  });

  test("freshness - future", () => {
    const result = DateFormat.freshness("en", "2026-10-21", today);

    expect(result).toEqual("in 2 weeks");
  });

  test("freshness - pl", () => {
    const result = DateFormat.freshness("pl", "2026-10-05", today);

    expect(result).toEqual("przedwczoraj");
  });

  test("range", () => {
    const result = DateFormat.range("en", "2026-09-29", "2026-10-05");

    expect(result).toEqual("Sep 29 – Oct 5, 2026");
  });

  test("range - across years", () => {
    const result = DateFormat.range("en", "2025-12-29", "2026-01-04");

    expect(result).toEqual("Dec 29, 2025 – Jan 4, 2026");
  });

  test("range - pl", () => {
    const result = DateFormat.range("pl", "2026-09-29", "2026-10-05");

    expect(result).toEqual("29.09–05.10.2026");
  });

  test("parts", () => {
    const result = DateFormat.parts("en", "2026-10-07");

    expect(result).toEqual({ month: "Oct", day: "7", weekday: "Wed" });
  });

  test("parts - pl", () => {
    const result = DateFormat.parts("pl", "2026-10-07");

    expect(result).toEqual({ month: "paź", day: "7", weekday: "śr." });
  });

  test("ago - 59 seconds", () => {
    const result = DateFormat.ago("en", 1791374341000, now);

    expect(result).toEqual("now");
  });

  test("ago - 1 minute", () => {
    const result = DateFormat.ago("en", 1791374340000, now);

    expect(result).toEqual("1 minute ago");
  });

  test("ago - 59 minutes", () => {
    const result = DateFormat.ago("en", 1791370860000, now);

    expect(result).toEqual("59 minutes ago");
  });

  test("ago - 1 hour", () => {
    const result = DateFormat.ago("en", 1791370800000, now);

    expect(result).toEqual("1 hour ago");
  });

  test("ago - 23 hours 59 minutes", () => {
    const result = DateFormat.ago("en", 1791288060000, now);

    expect(result).toEqual("23 hours ago");
  });

  test("ago - 24 hours", () => {
    const result = DateFormat.ago("en", 1791288000000, now);

    expect(result).toEqual("yesterday");
  });

  test("ago - UTC day", () => {
    const result = DateFormat.ago("en", 1791239400000, now, "UTC");

    expect(result).toEqual("2 days ago");
  });

  test("ago - local day", () => {
    const result = DateFormat.ago("en", 1791239400000, now, "Europe/Warsaw");

    expect(result).toEqual("yesterday");
  });

  test("ago - pl", () => {
    const result = DateFormat.ago("pl", 1791370800000, now);

    expect(result).toEqual("1 godzinę temu");
  });

  test("instantFull", () => {
    const result = DateFormat.instantFull("en", now, "UTC");

    expect(result).toEqual("Oct 7, 2026 at 12:00 PM");
  });

  test("instantFull - time zone", () => {
    const result = DateFormat.instantFull("en", now, "Europe/Warsaw");

    expect(result).toEqual("Oct 7, 2026 at 2:00 PM");
  });

  test("instantFull - pl", () => {
    const result = DateFormat.instantFull("pl", now, "Europe/Warsaw");

    expect(result).toEqual("7 paź 2026 o 14:00");
  });
});
