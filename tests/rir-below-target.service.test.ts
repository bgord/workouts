import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("RirBelowTarget", () => {
  test("below target", () => {
    const rirBelowTarget = new Workouts.Services.RirBelowTarget({
      target: mocks.rirTarget,
      rir: v.parse(Workouts.VO.Rir, 1),
    });

    expect(rirBelowTarget.calculate()).toEqual(true);
  });

  test("at target", () => {
    const rirBelowTarget = new Workouts.Services.RirBelowTarget({
      target: mocks.rirTarget,
      rir: v.parse(Workouts.VO.Rir, 2),
    });

    expect(rirBelowTarget.calculate()).toEqual(false);
  });

  test("above target", () => {
    const rirBelowTarget = new Workouts.Services.RirBelowTarget({
      target: mocks.rirTarget,
      rir: v.parse(Workouts.VO.Rir, 3),
    });

    expect(rirBelowTarget.calculate()).toEqual(false);
  });

  test("no rir logged", () => {
    const rirBelowTarget = new Workouts.Services.RirBelowTarget({ target: mocks.rirTarget, rir: null });

    expect(rirBelowTarget.calculate()).toEqual(false);
  });

  test("rir unknown", () => {
    const rirBelowTarget = new Workouts.Services.RirBelowTarget({
      target: mocks.rirTarget,
      rir: undefined,
    });

    expect(rirBelowTarget.calculate()).toEqual(false);
  });

  test("no target", () => {
    const rirBelowTarget = new Workouts.Services.RirBelowTarget({
      target: undefined,
      rir: v.parse(Workouts.VO.Rir, 0),
    });

    expect(rirBelowTarget.calculate()).toEqual(false);
  });
});
