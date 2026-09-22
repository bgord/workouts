import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanGetExerciseInstructionActions", () => {
  test("draft", () => {
    const actions = new Plans.Services.PlanGetExerciseInstructionActions({
      status: Plans.VO.PlanStatusEnum.draft,
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionAvailable,
      exerciseChange: mocks.actionAvailable,
      move: mocks.actionAvailable,
      remove: mocks.actionAvailable,
    });
  });

  test("finalized", () => {
    const actions = new Plans.Services.PlanGetExerciseInstructionActions({
      status: Plans.VO.PlanStatusEnum.finalized,
    });

    expect(actions.calculate()).toEqual({
      update: mocks.actionUnavailable,
      exerciseChange: mocks.actionUnavailable,
      move: mocks.actionUnavailable,
      remove: mocks.actionUnavailable,
    });
  });
});
