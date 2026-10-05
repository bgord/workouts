import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Measurements from "+measurements";

describe("BodyWeight", () => {
  test("happy path", () => {
    expect(v.safeParse(Measurements.VO.BodyWeight, 1).success).toEqual(true);
    expect(v.safeParse(Measurements.VO.BodyWeight, 80_300).success).toEqual(true);
  });

  test("rejects negative", () => {
    expect(() => v.parse(Measurements.VO.BodyWeight, -1)).toThrow("weight.grams.invalid");
  });

  test("rejects zero", () => {
    expect(() => v.parse(Measurements.VO.BodyWeight, 0)).toThrow("body.weight.invalid");
  });
});
