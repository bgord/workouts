import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanCategoryCoverage", () => {
  test("calculate - no instructions", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory, mocks.anotherExerciseCategory],
      instructions: [],
    });

    expect(coverage.calculate()).toEqual([
      {
        category: mocks.exerciseCategory,
        primarySets: tools.Int.nonNegative(0),
        secondarySets: tools.Int.nonNegative(0),
        total: 0,
        primaryShare: 0,
        secondaryShare: 0,
      },
      {
        category: mocks.anotherExerciseCategory,
        primarySets: tools.Int.nonNegative(0),
        secondarySets: tools.Int.nonNegative(0),
        total: 0,
        primaryShare: 0,
        secondaryShare: 0,
      },
    ]);
  });

  test("calculate - primary", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory, mocks.anotherExerciseCategory],
      instructions: [{ sets: mocks.sets, categories: [mocks.exerciseCategoryAssignment] }],
    });

    expect(coverage.calculate()).toEqual([
      {
        category: mocks.exerciseCategory,
        primarySets: tools.Int.nonNegative(3),
        secondarySets: tools.Int.nonNegative(0),
        total: 3,
        primaryShare: 1,
        secondaryShare: 0,
      },
      {
        category: mocks.anotherExerciseCategory,
        primarySets: tools.Int.nonNegative(0),
        secondarySets: tools.Int.nonNegative(0),
        total: 0,
        primaryShare: 0,
        secondaryShare: 0,
      },
    ]);
  });

  test("calculate - secondary", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory, mocks.anotherExerciseCategory],
      instructions: [{ sets: mocks.sets, categories: [mocks.anotherExerciseCategoryAssignment] }],
    });

    expect(coverage.calculate()).toEqual([
      {
        category: mocks.anotherExerciseCategory,
        primarySets: tools.Int.nonNegative(0),
        secondarySets: tools.Int.nonNegative(3),
        total: 1.5,
        primaryShare: 0,
        secondaryShare: 1,
      },
      {
        category: mocks.exerciseCategory,
        primarySets: tools.Int.nonNegative(0),
        secondarySets: tools.Int.nonNegative(0),
        total: 0,
        primaryShare: 0,
        secondaryShare: 0,
      },
    ]);
  });

  test("calculate - primary and secondary across instructions", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory],
      instructions: [
        { sets: mocks.sets, categories: [mocks.exerciseCategoryAssignment] },
        {
          sets: mocks.anotherSets,
          categories: [{ ...mocks.exerciseCategory, role: mocks.anotherExerciseCategoryRole }],
        },
      ],
    });

    expect(coverage.calculate()).toEqual([
      {
        category: mocks.exerciseCategory,
        primarySets: tools.Int.nonNegative(3),
        secondarySets: tools.Int.nonNegative(4),
        total: 5,
        primaryShare: 0.6,
        secondaryShare: 0.4,
      },
    ]);
  });

  test("calculate - same exercise twice", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory],
      instructions: [
        { sets: mocks.sets, categories: [mocks.exerciseCategoryAssignment] },
        { sets: mocks.anotherSets, categories: [mocks.exerciseCategoryAssignment] },
      ],
    });

    expect(coverage.calculate()).toEqual([
      {
        category: mocks.exerciseCategory,
        primarySets: tools.Int.nonNegative(7),
        secondarySets: tools.Int.nonNegative(0),
        total: 7,
        primaryShare: 1,
        secondaryShare: 0,
      },
    ]);
  });

  test("calculate - sorting", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory, mocks.anotherExerciseCategory],
      instructions: [
        {
          sets: mocks.sets,
          categories: [
            { ...mocks.exerciseCategory, role: mocks.anotherExerciseCategoryRole },
            { ...mocks.anotherExerciseCategory, role: mocks.exerciseCategoryRole },
          ],
        },
      ],
    });

    expect(coverage.calculate()).toEqual([
      {
        category: mocks.anotherExerciseCategory,
        primarySets: tools.Int.nonNegative(3),
        secondarySets: tools.Int.nonNegative(0),
        total: 3,
        primaryShare: 1,
        secondaryShare: 0,
      },
      {
        category: mocks.exerciseCategory,
        primarySets: tools.Int.nonNegative(0),
        secondarySets: tools.Int.nonNegative(3),
        total: 1.5,
        primaryShare: 0,
        secondaryShare: 0.5,
      },
    ]);
  });
});
