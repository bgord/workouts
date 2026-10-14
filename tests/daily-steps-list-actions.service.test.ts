import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("DailyStepsListActions", () => {
  test("entries", () => {
    const actions = new Measurements.Services.DailyStepsListActions({ entries: [mocks.dailySteps] });

    expect(actions.calculate()).toEqual({ export: mocks.actionAvailable });
  });

  test("no entries", () => {
    const actions = new Measurements.Services.DailyStepsListActions({ entries: [] });

    expect(actions.calculate()).toEqual({ export: mocks.actionUnavailable });
  });
});
