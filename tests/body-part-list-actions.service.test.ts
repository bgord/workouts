import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartListActions", () => {
  test("active body part", () => {
    const actions = new Measurements.Services.BodyPartListActions({
      bodyParts: [mocks.bodyPart],
      measurements: [mocks.bodyPartMeasurement],
    });

    expect(actions.calculate()).toEqual({ export: mocks.actionAvailable, import: mocks.actionAvailable });
  });

  test("no measurements", () => {
    const actions = new Measurements.Services.BodyPartListActions({
      bodyParts: [mocks.bodyPart],
      measurements: [],
    });

    expect(actions.calculate()).toEqual({ export: mocks.actionUnavailable, import: mocks.actionAvailable });
  });

  test("BodyPartIsDefined", () => {
    const actions = new Measurements.Services.BodyPartListActions({ bodyParts: [], measurements: [] });

    expect(actions.calculate()).toEqual({
      export: mocks.actionUnavailable,
      import: { available: true, enabled: false, hints: ["body.part.is.defined"] },
    });
  });
});
