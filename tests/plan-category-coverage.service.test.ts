import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanCategoryCoverage", () => {
  test("calculate - no instructions", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory, mocks.anotherExerciseCategory],
      instructions: [],
    });

    expect(coverage.calculate()).toEqual([
      { category: mocks.exerciseCategory, primarySets: 0, secondarySets: 0, total: 0 },
      { category: mocks.anotherExerciseCategory, primarySets: 0, secondarySets: 0, total: 0 },
    ]);
  });

  test("calculate - primary", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory, mocks.anotherExerciseCategory],
      instructions: [{ sets: mocks.sets, categories: [mocks.exerciseCategoryAssignment] }],
    });

    expect(coverage.calculate()).toEqual([
      { category: mocks.exerciseCategory, primarySets: 3, secondarySets: 0, total: 3 },
      { category: mocks.anotherExerciseCategory, primarySets: 0, secondarySets: 0, total: 0 },
    ]);
  });

  test("calculate - secondary", () => {
    const coverage = new Plans.Services.PlanCategoryCoverage({
      categories: [mocks.exerciseCategory, mocks.anotherExerciseCategory],
      instructions: [{ sets: mocks.sets, categories: [mocks.anotherExerciseCategoryAssignment] }],
    });

    expect(coverage.calculate()).toEqual([
      { category: mocks.anotherExerciseCategory, primarySets: 0, secondarySets: 3, total: 1.5 },
      { category: mocks.exerciseCategory, primarySets: 0, secondarySets: 0, total: 0 },
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
      { category: mocks.exerciseCategory, primarySets: 3, secondarySets: 4, total: 5 },
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
      { category: mocks.exerciseCategory, primarySets: 7, secondarySets: 0, total: 7 },
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
      { category: mocks.anotherExerciseCategory, primarySets: 3, secondarySets: 0, total: 3 },
      { category: mocks.exerciseCategory, primarySets: 0, secondarySets: 3, total: 1.5 },
    ]);
  });
});
