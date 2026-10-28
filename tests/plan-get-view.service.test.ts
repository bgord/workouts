import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Exercises from "+exercises";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanGetView", () => {
  test("happy path", () => {
    const view = new Plans.Services.PlanGetView({
      plan: {
        ...mocks.plan,
        sections: [
          {
            ...mocks.planSection,
            exerciseInstructions: [
              {
                id: mocks.exerciseInstruction.id,
                sets: mocks.exerciseInstruction.sets,
                reps: mocks.exerciseInstruction.reps,
                progression: mocks.progression,
                rir: null,
                exercise: {
                  ...mocks.exercise,
                  categoryAssignments: [
                    {
                      role: Exercises.VO.ExerciseCategoryRoleOptions.primary,
                      category: mocks.exerciseCategory,
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      activeCount: tools.Int.nonNegative(0),
      categories: [mocks.exerciseCategory],
    });

    expect(view.calculate()).toEqual({
      data: {
        ...mocks.plan,
        sections: [
          {
            ...mocks.planSection,
            exerciseInstructions: [
              {
                id: mocks.exerciseInstruction.id,
                sets: mocks.exerciseInstruction.sets,
                reps: mocks.exerciseInstruction.reps,
                progression: mocks.progression,
                rir: null,
                exercise: {
                  ...mocks.exercise,
                  progressionMethods: [
                    Plans.VO.ProgressionMethodOptions.double_progression,
                    Plans.VO.ProgressionMethodOptions.linear_progression,
                    Plans.VO.ProgressionMethodOptions.rep_progression,
                    Plans.VO.ProgressionMethodOptions.none,
                  ],
                },
                actions: {
                  update: mocks.actionAvailable,
                  moveUp: mocks.actionUnavailable,
                  moveDown: mocks.actionUnavailable,
                  remove: mocks.actionAvailable,
                },
              },
            ],
            actions: { exerciseInstructionAdd: mocks.actionAvailable },
          },
        ],
      },
      actions: {
        finalize: mocks.actionAvailable,
        rename: mocks.actionAvailable,
        descriptionSet: mocks.actionAvailable,
        editingEnable: mocks.actionUnavailable,
        archive: mocks.actionAvailable,
        restore: mocks.actionUnavailable,
        remove: mocks.actionAvailable,
        sectionCreate: mocks.actionAvailable,
        sectionRename: mocks.actionAvailable,
        sectionWarmupSet: mocks.actionAvailable,
        sectionCooldownSet: mocks.actionAvailable,
        sectionRemove: mocks.actionAvailable,
        coverageView: mocks.actionAvailable,
      },
      coverage: mocks.planCategoryCoverage,
    });
  });

  test("happy path - no category assignments", () => {
    const view = new Plans.Services.PlanGetView({
      plan: {
        ...mocks.plan,
        sections: [
          {
            ...mocks.planSection,
            exerciseInstructions: [
              {
                id: mocks.exerciseInstruction.id,
                sets: mocks.exerciseInstruction.sets,
                reps: mocks.exerciseInstruction.reps,
                progression: mocks.progression,
                rir: null,
                exercise: { ...mocks.exercise, categoryAssignments: [] },
              },
            ],
          },
        ],
      },
      activeCount: tools.Int.nonNegative(0),
      categories: [mocks.exerciseCategory],
    });

    const result = view.calculate();

    expect(result.coverage).toEqual(mocks.planCategoryCoverageEmpty);
    expect(result.actions.coverageView).toEqual(mocks.actionUnavailable);
  });
});
