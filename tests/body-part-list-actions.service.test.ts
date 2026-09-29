import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartListActions", () => {
  test("active body part", () => {
    const actions = new Measurements.Services.BodyPartListActions({
      bodyParts: [mocks.archivedBodyPart, mocks.bodyPart],
    });

    expect(actions.calculate()).toEqual({ measure: mocks.actionAvailable });
  });

  test("BodyPartIsDefined - empty", () => {
    const actions = new Measurements.Services.BodyPartListActions({ bodyParts: [] });

    expect(actions.calculate()).toEqual({
      measure: { available: true, enabled: false, hints: ["body.part.is.defined"] },
    });
  });

  test("BodyPartIsDefined - archived only", () => {
    const actions = new Measurements.Services.BodyPartListActions({ bodyParts: [mocks.archivedBodyPart] });

    expect(actions.calculate()).toEqual({
      measure: { available: true, enabled: false, hints: ["body.part.is.defined"] },
    });
  });
});
