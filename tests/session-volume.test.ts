import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Stats from "+stats";
import * as mocks from "./mocks";

describe("SessionVolume", () => {
  test("single set", () => {
    expect(Stats.Services.SessionVolume.calculate([mocks.singleRepSet])).toEqual(
      v.parse(Stats.VO.Volume, 100_000),
    );
  });

  test("multiple sets", () => {
    expect(Stats.Services.SessionVolume.calculate([mocks.singleRepSet, mocks.fiveRepSet])).toEqual(
      v.parse(Stats.VO.Volume, 600_000),
    );
  });

  test("no sets", () => {
    expect(Stats.Services.SessionVolume.calculate([])).toEqual(v.parse(Stats.VO.Volume, 0));
  });
});
