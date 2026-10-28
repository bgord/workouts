import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("ExerciseSignalWindow", () => {
  test("happy path", () => {
    const window = new Workouts.Services.ExerciseSignalWindow({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
        { ...mocks.hitExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-01") },
      ],
    });

    expect(window.sessions()).toEqual([
      { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
      { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
      { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
    ]);
  });

  test("happy path - gap below the break", () => {
    const window = new Workouts.Services.ExerciseSignalWindow({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-26") },
      ],
    });

    expect(window.sessions()).toEqual([
      { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
      { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
      { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-26") },
    ]);
  });

  test("fewer sessions than the window", () => {
    const window = new Workouts.Services.ExerciseSignalWindow({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
      ],
    });

    expect(window.sessions()).toEqual(undefined);
  });

  test("break between sessions", () => {
    const window = new Workouts.Services.ExerciseSignalWindow({
      scheduledFor: v.parse(tools.DayIsoId, "2025-01-29"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2024-12-25") },
      ],
    });

    expect(window.sessions()).toEqual(undefined);
  });

  test("break before the current workout", () => {
    const window = new Workouts.Services.ExerciseSignalWindow({
      scheduledFor: v.parse(tools.DayIsoId, "2025-02-12"),
      performances: [
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-22") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-15") },
        { ...mocks.missedExerciseRecentPerformance, scheduledFor: v.parse(tools.DayIsoId, "2025-01-08") },
      ],
    });

    expect(window.sessions()).toEqual(undefined);
  });
});
