import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyPartDescription", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyPartDescription, "f".repeat(500)).success).toEqual(true);
    expect(
      v.safeParse(Measurements.VO.BodyPartDescription, "Relaxed, tape level at the navel.\nAfter exhale.")
        .success,
    ).toEqual(true);
  });

  test("happy path - trimmed", () => {
    expect(v.parse(Measurements.VO.BodyPartDescription, "  Relaxed\n")).toEqual(
      v.parse(Measurements.VO.BodyPartDescription, "Relaxed"),
    );
  });

  test("rejects non-string - null", () => {
    expect(() => v.parse(Measurements.VO.BodyPartDescription, null)).toThrow("body.part.description.type");
  });

  test("rejects non-string - number", () => {
    expect(() => v.parse(Measurements.VO.BodyPartDescription, 2024)).toThrow("body.part.description.type");
  });

  test("rejects empty", () => {
    expect(() => v.parse(Measurements.VO.BodyPartDescription, "")).toThrow("body.part.description.invalid");
  });

  test("rejects whitespace only", () => {
    expect(() => v.parse(Measurements.VO.BodyPartDescription, " \n\t ")).toThrow(
      "body.part.description.invalid",
    );
  });

  test("rejects too long", () => {
    expect(() => v.parse(Measurements.VO.BodyPartDescription, "f".repeat(501))).toThrow(
      "body.part.description.invalid",
    );
  });
});
