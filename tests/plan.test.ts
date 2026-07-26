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

  test("create", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const plan = Plans.Aggregates.Plan.create(
        mocks.planId,
        mocks.planName,
        mocks.userId,
        di.Adapters.System,
      );

      expect(plan.pullEvents()).toEqual([mocks.GenericPlanCreatedEvent]);
    });
  });

  test("createSection - first", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
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
      [mocks.GenericPlanCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 5)],
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
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("createSection - PlanSectionLimitForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 6)],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionLimitForPlan.error,
    );
  });

  test("createSection - PlanSectionNameIsUniqueForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionNameIsUniqueForPlan.error,
    );
  });

  test("renameSection", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
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
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("renameSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("renameSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("renameSection - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.renameSection(mocks.anotherPlanSectionId, mocks.anotherPlanSectionName, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("renameSection - PlanSectionNameIsUniqueForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionNameIsUniqueForPlan.error,
    );
  });

  test("removeSection", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
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
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("removeSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("removeSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("removeSection - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.removeSection(mocks.anotherPlanSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionExists.error,
    );
  });

  test("archive - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.archive(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanArchivedEvent]);
  });

  test("archive - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
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
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.archive(mocks.userId)).toThrow(Plans.Invariants.PlanIsArchivable.error);
  });

  test("archive - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.archive(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("finalize", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
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
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("finalize - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("finalize - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.finalize(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("restore", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
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
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("restore - PlanIsArchivable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("restore - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.restore(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("enableEditing", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.enableEditing(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanEditingEnabledEvent]);
  });

  test("enableEditing - PlanIsFinalized - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.enableEditing(mocks.userId)).toThrow(Plans.Invariants.PlanIsFinalized.error);
  });

  test("enableEditing - PlanIsFinalized - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.enableEditing(mocks.userId)).toThrow(Plans.Invariants.PlanIsFinalized.error);
  });

  test("enableEditing - PlanIsFinalized - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.enableEditing(mocks.userId)).toThrow(Plans.Invariants.PlanIsFinalized.error);
  });

  test("enableEditing - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.enableEditing(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("rename", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.rename(mocks.anotherPlanName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRenamedEvent]);
  });

  test("rename - PlanIsEditable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() => plan.rename(mocks.anotherPlanName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("rename - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() => plan.rename(mocks.anotherPlanName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("rename - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() => plan.rename(mocks.anotherPlanName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("rename - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.rename(mocks.anotherPlanName, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("rename - PlanNameHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() => plan.rename(mocks.planName, mocks.userId)).toThrow(
      Plans.Invariants.PlanNameHasChanged.error,
    );
  });

  test("addExerciseInstruction - first", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.addExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanExerciseInstructionAddedEvent]);
  });

  test("addExerciseInstruction - at the limit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        ...tools.repeat(mocks.GenericPlanExerciseInstructionAddedEvent, 19),
      ],
      di.Adapters.System,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.addExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanExerciseInstructionAddedEvent]);
  });

  test("addExerciseInstruction - PlanIsEditable - initial", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [], di.Adapters.System);

    expect(() =>
      plan.addExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("addExerciseInstruction - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.addExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("addExerciseInstruction - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.addExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("addExerciseInstruction - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.addExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("addExerciseInstruction - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      di.Adapters.System,
    );

    expect(() =>
      plan.addExerciseInstruction(mocks.anotherPlanSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("addExerciseInstruction - PlanSectionExerciseInstructionLimit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        ...tools.repeat(mocks.GenericPlanExerciseInstructionAddedEvent, 20),
      ],
      di.Adapters.System,
    );

    expect(() =>
      plan.addExerciseInstruction(mocks.anotherPlanSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });
});
