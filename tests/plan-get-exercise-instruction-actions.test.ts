import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanGetExerciseInstructionActions", () => {
  test("draft - first", () => {
    const actions = new Plans.Services.PlanGetExerciseInstructionActions({
      status: Plans.VO.PlanStatusEnum.draft,
      section: mocks.planSectionWithTwoExerciseInstructions,
      exerciseInstructionId: mocks.exerciseInstruction.id,
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionAvailable,
      exerciseChange: mocks.actionAvailable,
      moveUp: {
        available: true,
        enabled: false,
        hints: ["plan.section.exercise.instruction.position.has.changed"],
      },
      moveDown: mocks.actionAvailable,
      remove: mocks.actionAvailable,
    });
  });

  test("draft - last", () => {
    const actions = new Plans.Services.PlanGetExerciseInstructionActions({
      status: Plans.VO.PlanStatusEnum.draft,
      section: mocks.planSectionWithTwoExerciseInstructions,
      exerciseInstructionId: mocks.anotherExerciseInstructionAndId.id,
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionAvailable,
      exerciseChange: mocks.actionAvailable,
      moveUp: mocks.actionAvailable,
      moveDown: {
        available: true,
        enabled: false,
        hints: ["plan.section.exercise.instruction.position.in.range"],
      },
      remove: mocks.actionAvailable,
    });
  });

  test("finalized", () => {
    const actions = new Plans.Services.PlanGetExerciseInstructionActions({
      status: Plans.VO.PlanStatusEnum.finalized,
      section: mocks.planSectionWithTwoExerciseInstructions,
      exerciseInstructionId: mocks.exerciseInstruction.id,
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionUnavailable,
      exerciseChange: mocks.actionUnavailable,
      moveUp: mocks.actionUnavailable,
      moveDown: mocks.actionUnavailable,
      remove: mocks.actionUnavailable,
    });
  });
});
