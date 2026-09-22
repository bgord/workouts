import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as Notifications from "+notifications";
import * as Workouts from "+workouts";
import * as mocks from "./mocks";

const empty = {
  week: mocks.week,
  workouts: [],
  previousWorkouts: [],
  performances: [],
  measurements: [],
  completed: mocks.workoutDashboardCompleted,
};

describe("WeeklySummaryCalculator", () => {
  test("nothing to report", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator(empty);

    expect(calculator.calculate()).toEqual(null);
  });

  test("happy path", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      workouts: [mocks.weekCompletedWorkout],
      performances: [mocks.weekExercisePerformance],
    });

    expect(calculator.calculate()).toEqual(mocks.weeklySummary);
  });

  test("numbers - delta against previous week", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      workouts: [mocks.weekCompletedWorkout],
      previousWorkouts: [mocks.weekCompletedWorkout, mocks.weekCompletedWorkout],
    });

    expect(calculator.calculate()?.numbers).toEqual({
      workouts: {
        current: tools.Int.nonNegative(1),
        previous: tools.Int.nonNegative(2),
        delta: -1,
        direction: Notifications.VO.ComparisonDirections.down,
      },
      sets: {
        current: tools.Int.nonNegative(2),
        previous: tools.Int.nonNegative(4),
        delta: -2,
        direction: Notifications.VO.ComparisonDirections.down,
      },
      volume: {
        current: v.parse(tools.WeightGrams, tools.Weight.fromKilograms(1350).get()),
        previous: v.parse(tools.WeightGrams, tools.Weight.fromKilograms(2700).get()),
        delta: -tools.Weight.fromKilograms(1350).get(),
        direction: Notifications.VO.ComparisonDirections.down,
      },
    });
  });

  test("highlights - reps up at same load", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      workouts: [mocks.weekCompletedWorkout],
      performances: [
        {
          ...mocks.weekExercisePerformance,
          previous: {
            ...mocks.weekExercisePerformance.previous!,
            sets: [
              {
                setNumber: v.parse(Workouts.VO.SetNumber, 1),
                reps: v.parse(Workouts.VO.Reps, 4),
                load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
              },
            ],
          },
        },
      ],
    });

    expect(calculator.calculate()?.highlights).toEqual([
      {
        ...mocks.weeklySummaryHighlight,
        previous: v.parse(Workouts.VO.ExerciseTarget, {
          sets: v.parse(Workouts.VO.Sets, 1),
          reps: v.parse(Workouts.VO.Reps, 4),
          load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
        }),
      },
    ]);
  });

  test("highlights - reps up at lower load is not progress", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      workouts: [mocks.weekCompletedWorkout],
      performances: [
        {
          ...mocks.weekExercisePerformance,
          previous: {
            ...mocks.weekExercisePerformance.previous!,
            sets: [
              {
                setNumber: v.parse(Workouts.VO.SetNumber, 1),
                reps: v.parse(Workouts.VO.Reps, 3),
                load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
              },
            ],
          },
        },
      ],
    });

    expect(calculator.calculate()?.highlights).toEqual([]);
  });

  test("highlights - same weakest set is not progress", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      workouts: [mocks.weekCompletedWorkout],
      performances: [{ ...mocks.weekExercisePerformance, previous: mocks.exercisePerformance }],
    });

    expect(calculator.calculate()?.highlights).toEqual([]);
  });

  test("highlights - no previous performance", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      workouts: [mocks.weekCompletedWorkout],
      performances: [{ ...mocks.weekExercisePerformance, previous: undefined }],
    });

    expect(calculator.calculate()?.highlights).toEqual([]);
  });

  test("body weight - only section", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      measurements: [mocks.bodyWeightMeasurement],
    });

    expect(calculator.calculate()).toEqual({
      ...mocks.weeklySummary,
      numbers: {
        workouts: {
          current: tools.Int.nonNegative(0),
          previous: tools.Int.nonNegative(0),
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.flat,
        },
        sets: {
          current: tools.Int.nonNegative(0),
          previous: tools.Int.nonNegative(0),
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.flat,
        },
        volume: {
          current: v.parse(tools.WeightGrams, 0),
          previous: v.parse(tools.WeightGrams, 0),
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.flat,
        },
      },
      highlights: [],
      bodyWeight: {
        average: {
          current: mocks.bodyWeight,
          previous: undefined,
          delta: 0,
          direction: Notifications.VO.ComparisonDirections.unknown,
        },
        count: tools.Int.positive(1),
      },
    });
  });

  test("body weight - previous week average and reference goal", () => {
    const heavier = v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(82).get());

    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      measurements: [
        mocks.bodyWeightMeasurement,
        { ...mocks.bodyWeightMeasurement, weight: heavier, measuredOn: mocks.anotherBodyWeightMeasuredOn },
        {
          ...mocks.bodyWeightReferenceMeasurement,
          weight: heavier,
          measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-27"),
          goal: Measurements.VO.BodyWeightGoalOptions.cut,
        },
        {
          ...mocks.bodyWeightMeasurement,
          weight: heavier,
          measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-01"),
        },
      ],
    });

    expect(calculator.calculate()?.bodyWeight).toEqual({
      average: {
        current: (mocks.bodyWeight + heavier) / 2,
        previous: heavier,
        delta: (mocks.bodyWeight - heavier) / 2,
        direction: Notifications.VO.ComparisonDirections.down,
      },
      count: tools.Int.positive(2),
    });
  });

  test("body weight - measurement outside the week is ignored", () => {
    const calculator = new Notifications.Services.WeeklySummaryCalculator({
      ...empty,
      measurements: [
        {
          ...mocks.bodyWeightMeasurement,
          measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2025-01-06"),
        },
      ],
    });

    expect(calculator.calculate()).toEqual(null);
  });
});
