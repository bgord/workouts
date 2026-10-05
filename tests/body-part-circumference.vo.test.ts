import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyPartCircumference", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyPartCircumference, 1).success).toEqual(true);
    expect(v.safeParse(Measurements.VO.BodyPartCircumference, 370).success).toEqual(true);
  });

  test("rejects negative", () => {
    expect(() => v.parse(Measurements.VO.BodyPartCircumference, -1)).toThrow("height.millimeters.invalid");
  });

  test("rejects zero", () => {
    expect(() => v.parse(Measurements.VO.BodyPartCircumference, 0)).toThrow(
      "body.part.circumference.invalid",
    );
  });
});
