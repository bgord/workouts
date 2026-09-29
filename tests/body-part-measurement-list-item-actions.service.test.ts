import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartMeasurementListItemActions", () => {
  test("active body part", () => {
    const actions = new Measurements.Services.BodyPartMeasurementListItemActions({
      bodyPart: mocks.bodyPart,
    });

    expect(actions.calculate()).toEqual({ correct: mocks.actionAvailable });
  });

  test("archived body part", () => {
    const actions = new Measurements.Services.BodyPartMeasurementListItemActions({
      bodyPart: mocks.archivedBodyPart,
    });

    expect(actions.calculate()).toEqual({ correct: mocks.actionUnavailable });
  });
});
