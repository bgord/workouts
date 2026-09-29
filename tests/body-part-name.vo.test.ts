import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyPartName", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyPartName, "f".repeat(64)).success).toEqual(true);
    expect(v.safeParse(Measurements.VO.BodyPartName, "Left Bicep").success).toEqual(true);
    expect(v.safeParse(Measurements.VO.BodyPartName, "Chest").success).toEqual(true);
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Measurements.VO.BodyPartName, null)).toThrow("body.part.name.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Measurements.VO.BodyPartName, 2024)).toThrow("body.part.name.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Measurements.VO.BodyPartName, "")).toThrow("body.part.name.invalid");
  });

  test("rejects too long", () => {
    expect(() => v.parse(Measurements.VO.BodyPartName, "f".repeat(65))).toThrow("body.part.name.invalid");
  });
});
