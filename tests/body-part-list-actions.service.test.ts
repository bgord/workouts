import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartListActions", () => {
  test("active body part", () => {
    const actions = new Measurements.Services.BodyPartListActions({ active: [mocks.bodyPart] });

    expect(actions.calculate()).toEqual({ measure: mocks.actionAvailable });
  });

  test("BodyPartIsDefined", () => {
    const actions = new Measurements.Services.BodyPartListActions({ active: [] });

    expect(actions.calculate()).toEqual({
      measure: { available: true, enabled: false, hints: ["body.part.is.defined"] },
    });
  });
});
