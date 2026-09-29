import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import * as mocks from "./mocks";

describe("BodyPartListItemActions", () => {
  test("active", () => {
    const actions = new Measurements.Services.BodyPartListItemActions(mocks.bodyPart);

    expect(actions.calculate()).toEqual({ rename: mocks.actionAvailable, archive: mocks.actionAvailable });
  });

  test("archived", () => {
    const actions = new Measurements.Services.BodyPartListItemActions(mocks.archivedBodyPart);

    expect(actions.calculate()).toEqual({
      rename: mocks.actionUnavailable,
      archive: mocks.actionUnavailable,
    });
  });
});
