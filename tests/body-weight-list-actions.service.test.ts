import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyWeightListActions", () => {
  test("measurements", () => {
    const actions = new Measurements.Services.BodyWeightListActions({
      measurements: [mocks.bodyWeightMeasurement],
    });

    expect(actions.calculate()).toEqual({ export: mocks.actionAvailable });
  });

  test("no measurements", () => {
    const actions = new Measurements.Services.BodyWeightListActions({ measurements: [] });

    expect(actions.calculate()).toEqual({ export: mocks.actionUnavailable });
  });
});
