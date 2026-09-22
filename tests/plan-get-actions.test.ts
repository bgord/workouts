import { describe, expect, test } from "bun:test";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanGetActions", () => {
  test("draft", () => {
    const actions = new Plans.Services.PlanGetActions({
      status: Plans.VO.PlanStatusEnum.draft,
      sections: mocks.plan.sections,
    });

    expect(actions.calculate()).toEqual({
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
    });
  });

  test("draft - no sections", () => {
    const actions = new Plans.Services.PlanGetActions({
      status: Plans.VO.PlanStatusEnum.draft,
      sections: [],
    });

    expect(actions.calculate().finalize).toEqual({
      available: true,
      enabled: false,
      hints: ["plan.has.sections"],
    });
  });

  test("draft - empty section", () => {
    const actions = new Plans.Services.PlanGetActions({
      status: Plans.VO.PlanStatusEnum.draft,
      sections: [mocks.planSectionEmpty],
    });

    expect(actions.calculate().finalize).toEqual({
      available: true,
      enabled: false,
      hints: ["plan.has.no.empty.sections"],
    });
  });

  test("draft - section limit", () => {
    const actions = new Plans.Services.PlanGetActions({
      status: Plans.VO.PlanStatusEnum.draft,
      sections: mocks.planSectionsAtLimit,
    });

    expect(actions.calculate().sectionCreate).toEqual({
      available: true,
      enabled: false,
      hints: ["plan.section.limit.for.plan"],
    });
  });

  test("finalized", () => {
    const actions = new Plans.Services.PlanGetActions({
      status: Plans.VO.PlanStatusEnum.finalized,
      sections: [],
    });

    expect(actions.calculate()).toEqual({
      finalize: mocks.actionUnavailable,
      rename: mocks.actionUnavailable,
      descriptionSet: mocks.actionUnavailable,
      editingEnable: mocks.actionAvailable,
      archive: mocks.actionAvailable,
      restore: mocks.actionUnavailable,
      remove: mocks.actionUnavailable,
      sectionCreate: mocks.actionUnavailable,
      sectionRename: mocks.actionUnavailable,
      sectionWarmupSet: mocks.actionUnavailable,
      sectionCooldownSet: mocks.actionUnavailable,
      sectionRemove: mocks.actionUnavailable,
    });
  });

  test("archived", () => {
    const actions = new Plans.Services.PlanGetActions({
      status: Plans.VO.PlanStatusEnum.archived,
      sections: mocks.plan.sections,
    });

    expect(actions.calculate()).toEqual({
      finalize: mocks.actionUnavailable,
      rename: mocks.actionUnavailable,
      descriptionSet: mocks.actionUnavailable,
      editingEnable: mocks.actionUnavailable,
      archive: mocks.actionUnavailable,
      restore: mocks.actionAvailable,
      remove: mocks.actionAvailable,
      sectionCreate: mocks.actionUnavailable,
      sectionRename: mocks.actionUnavailable,
      sectionWarmupSet: mocks.actionUnavailable,
      sectionCooldownSet: mocks.actionUnavailable,
      sectionRemove: mocks.actionUnavailable,
    });
  });
});
