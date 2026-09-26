import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Measurements from "+measurements";

describe("BodyPartNameIsUnique", () => {
  test("passes - no body part with the same name", () => {
    expect(Measurements.Invariants.BodyPartNameIsUnique.passes({ count: tools.Int.nonNegative(0) })).toEqual(
      true,
    );
  });

  test("fails - another body part with the same name", () => {
    expect(Measurements.Invariants.BodyPartNameIsUnique.passes({ count: tools.Int.nonNegative(1) })).toEqual(
      false,
    );
  });

  test("enforce - throws", () => {
    expect(() =>
      Measurements.Invariants.BodyPartNameIsUnique.enforce({ count: tools.Int.nonNegative(1) }),
    ).toThrow(Measurements.Invariants.BodyPartNameIsUnique.error);
  });
});
