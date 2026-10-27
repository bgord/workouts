import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

describe("WorkoutListCursor", () => {
  test("happy path", () => {
    expect(
      v.safeParse(Workouts.VO.WorkoutListCursor, {
        scheduledFor: mocks.workoutScheduledFor,
        id: mocks.workoutId,
      }).success,
    ).toEqual(true);
  });

  test("rejects non-object", () => {
    expect(() => v.parse(Workouts.VO.WorkoutListCursor, "cursor")).toThrow("workout.list.cursor.invalid");
  });

  test("rejects missing scheduledFor", () => {
    expect(() => v.parse(Workouts.VO.WorkoutListCursor, { id: mocks.workoutId })).toThrow(
      "workout.list.cursor.invalid",
    );
  });

  test("rejects missing id", () => {
    expect(() => v.parse(Workouts.VO.WorkoutListCursor, { scheduledFor: mocks.workoutScheduledFor })).toThrow(
      "workout.list.cursor.invalid",
    );
  });

  test("rejects invalid scheduledFor", () => {
    expect(() =>
      v.parse(Workouts.VO.WorkoutListCursor, { scheduledFor: "abc", id: mocks.workoutId }),
    ).toThrow("day.iso.id.bad.chars");
  });

  test("rejects invalid id", () => {
    expect(() =>
      v.parse(Workouts.VO.WorkoutListCursor, { scheduledFor: mocks.workoutScheduledFor, id: "invalid" }),
    ).toThrow("uuid.type");
  });
});
