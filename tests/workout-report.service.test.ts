import { describe, expect, test } from "bun:test";
import * as v from "valibot";
import * as Workouts from "+workouts";
import { WorkoutReport } from "../web/services/workout-report";
import * as mocks from "./mocks";

describe("WorkoutReport", () => {
  test("happy path", () => {
    const workout = {
      ...mocks.workoutWithExerciseActions,
      completedAt: mocks.T0.ms,
      exercises: mocks.workoutWithExerciseActions.exercises.map((exercise) => ({
        ...exercise,
        loggedSets: exercise.loggedSets.map((set) => ({ ...set, rir: v.parse(Workouts.VO.Rir, 1) })),
      })),
    };

    const report = WorkoutReport.create(workout);

    expect(report).toEqual(
      [
        "# Workout: PPL - Push",
        "",
        "Completed at: 2025-01-01T00:00:00.000Z",
        "Workout id: f1c4b0a2-6d3e-4f81-9a7c-2b5e8d0f3a64",
        "Logged sets: 1",
        "",
        "| exercise | set number | reps | load (kg) | sides | reps in reserve |",
        "| --- | --- | --- | --- | --- | --- |",
        "| Bench Press Barbell Horizontal | 1 | 9 | 80 | both | 1 |",
      ].join("\n"),
    );
  });

  test("happy path - no rir logged", () => {
    const workout = { ...mocks.workoutWithExerciseActions, completedAt: mocks.T0.ms };

    const report = WorkoutReport.create(workout);

    expect(report).toEqual(
      [
        "# Workout: PPL - Push",
        "",
        "Completed at: 2025-01-01T00:00:00.000Z",
        "Workout id: f1c4b0a2-6d3e-4f81-9a7c-2b5e8d0f3a64",
        "Logged sets: 1",
        "",
        "| exercise | set number | reps | load (kg) | sides | reps in reserve |",
        "| --- | --- | --- | --- | --- | --- |",
        "| Bench Press Barbell Horizontal | 1 | 9 | 80 | both | 3+ |",
      ].join("\n"),
    );
  });
});
