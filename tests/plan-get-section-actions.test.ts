import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanGetSectionActions", () => {
  test("draft", () => {
    const actions = new Plans.Services.PlanGetSectionActions({
      status: Plans.VO.PlanStatusEnum.draft,
      section: mocks.planSectionEmpty,
    });

    expect(actions.calculate()).toEqual({ exerciseInstructionAdd: mocks.actionAvailable });
  });

  test("draft - exercise instruction limit", () => {
    const actions = new Plans.Services.PlanGetSectionActions({
      status: Plans.VO.PlanStatusEnum.draft,
      section: mocks.planSectionAtInstructionLimit,
    });

    expect(actions.calculate()).toEqual({
      exerciseInstructionAdd: {
        available: true,
        enabled: false,
        hints: ["plan.section.exercise.instruction.limit"],
      },
    });
  });

  test("finalized", () => {
    const actions = new Plans.Services.PlanGetSectionActions({
      status: Plans.VO.PlanStatusEnum.finalized,
      section: mocks.planSectionAtInstructionLimit,
    });

    expect(actions.calculate()).toEqual({ exerciseInstructionAdd: mocks.actionUnavailable });
  });
});
