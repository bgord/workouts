import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionSignalStallStrategy", () => {
  test("stall", () => {
    const strategy = new Workouts.Services.ProgressionSignalStallStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
      ],
    });

    expect(strategy.calculate()).toEqual(Workouts.VO.ProgressionSignalOptions.stall);
  });

  test("stall - gap below the break", () => {
    const strategy = new Workouts.Services.ProgressionSignalStallStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-26") },
      ],
    });

    expect(strategy.calculate()).toEqual(Workouts.VO.ProgressionSignalOptions.stall);
  });

  test("no stall - one hit", () => {
    const strategy = new Workouts.Services.ProgressionSignalStallStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.hitExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("no stall - fewer sessions than the window", () => {
    const strategy = new Workouts.Services.ProgressionSignalStallStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("no stall - break between sessions", () => {
    const strategy = new Workouts.Services.ProgressionSignalStallStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-25") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("no stall - break before the current workout", () => {
    const strategy = new Workouts.Services.ProgressionSignalStallStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-02-12"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });
});
