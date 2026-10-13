import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ProgressionSignalSkipStrategy", () => {
  test("skip", () => {
    const strategy = new Workouts.Services.ProgressionSignalSkipStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-01") },
      ],
    });

    expect(strategy.calculate()).toEqual(Workouts.VO.ProgressionSignalOptions.skip);
  });

  test("skip - gap below the break", () => {
    const strategy = new Workouts.Services.ProgressionSignalSkipStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-26") },
      ],
    });

    expect(strategy.calculate()).toEqual(Workouts.VO.ProgressionSignalOptions.skip);
  });

  test("no skip - one logged", () => {
    const strategy = new Workouts.Services.ProgressionSignalSkipStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("no skip - fewer sessions than the window", () => {
    const strategy = new Workouts.Services.ProgressionSignalSkipStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("no skip - break between sessions", () => {
    const strategy = new Workouts.Services.ProgressionSignalSkipStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-25") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });

  test("no skip - break before the current workout", () => {
    const strategy = new Workouts.Services.ProgressionSignalSkipStrategy({
      scheduledFor: v.parse(tools.DayIsoId, "2025-02-12"),
      performances: [
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.skippedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
      ],
    });

    expect(strategy.calculate()).toEqual(undefined);
  });
});
