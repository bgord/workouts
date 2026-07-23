import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan", async () => {
  const di = await bootstrap();

  test("build new aggregate", () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(plan.pullEvents()).toEqual([]);
  });

  test("createDraft", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const plan = Plans.Aggregates.Plan.createDraft(
        mocks.planId,
        mocks.planName,
        mocks.userId,
        di.Adapters.System,
      );

      expect(plan.pullEvents()).toEqual([mocks.GenericPlanDraftCreatedEvent]);
    });
  });

  test("createSection - first", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCreatedEvent]);
  });

  test("createSection - at the limit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 5)],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.createSection(mocks.anotherPlanSectionId, mocks.anotherPlanSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCreatedEventSecond]);
  });

  test("createSection - PlanIsEditable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("createSection - PlanSectionLimitForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 6)],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionLimitForPlan.error,
    );
  });

  test("createSection - PlanSectionNameIsUniqueForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionNameIsUniqueForPlan.error,
    );
  });

  test("renameSection", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionRenamedEvent]);
  });

  test("renameSection - PlanIsEditable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("renameSection - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("renameSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("renameSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("renameSection - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.renameSection(mocks.anotherPlanSectionId, mocks.anotherPlanSectionName, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("renameSection - PlanSectionNameIsUniqueForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionNameIsUniqueForPlan.error,
    );
  });

  test("removeSection", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.removeSection(mocks.planSectionId, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionRemovedEvent]);
  });

  test("removeSection - PlanIsEditable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.removeSection(mocks.planSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("removeSection - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("removeSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("removeSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("removeSection - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.anotherPlanSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionExists.error,
    );
  });

  test("archive - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.archive(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanArchivedEvent]);
  });

  test("archive - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.archive(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanArchivedEvent]);
  });

  test("archive - PlanIsArchivable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.archive(mocks.userId)).toThrow(Plans.Invariants.PlanIsArchivable.error);
  });

  test("archive - PlanIsArchivable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.archive(mocks.userId)).toThrow(Plans.Invariants.PlanIsArchivable.error);
  });

  test("archive - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.archive(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("finalize", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.finalize(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanFinalizedEvent]);
  });

  test("finalize - PlanIsEditable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("finalize - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("finalize - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("finalize - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.finalize(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("restore", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.restore(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRestoredEvent]);
  });

  test("restore - PlanIsRestorable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.archive(mocks.userId)).toThrow(Plans.Invariants.PlanIsArchivable.error);
  });

  test("restore - PlanIsRestorable - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("restore - PlanIsArchivable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("restore - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanDraftCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.restore(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });
});
