import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Preferences from "+preferences";

describe("WeeklySummary", () => {
  test("happy path", () => {
    expect(v.safeParse(Preferences.VO.WeeklySummary, "on").success).toEqual(true);
  });

  test("rejects invalid", () => {
    expect(() => v.parse(Preferences.VO.WeeklySummary, "invalid")).toThrow("weekly.summary.invalid");
  });
});
