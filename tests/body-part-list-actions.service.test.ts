import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartListActions", () => {
  test("active body part", () => {
    const actions = new Measurements.Services.BodyPartListActions({ bodyParts: [mocks.bodyPart] });

    expect(actions.calculate()).toEqual({ import: mocks.actionAvailable });
  });

  test("BodyPartIsDefined", () => {
    const actions = new Measurements.Services.BodyPartListActions({ bodyParts: [] });

    expect(actions.calculate()).toEqual({
      import: { available: true, enabled: false, hints: ["body.part.is.defined"] },
    });
  });
});
