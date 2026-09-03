import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("build - PlanExists", () => {
    expect(() => Plans.Aggregates.Plan.build(mocks.planId, [], deps)).toThrow(
      Plans.Invariants.PlanExists.error,
    );
  });

  test("build - no pending events", () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(plan.pullEvents()).toEqual([]);
  });

  test("create", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, async () => {
      const plan = Plans.Aggregates.Plan.create(mocks.planId, mocks.planName, mocks.userId, deps);

      expect(plan.pullEvents()).toEqual([mocks.GenericPlanCreatedEvent]);
    });
  });

  test("createSection - first", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCreatedEvent]);
  });

  test("createSection - below the limit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 4)],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.createSection(mocks.anotherPlanSectionId, mocks.anotherPlanSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionCreatedEventSecond]);
  });

  test("createSection - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("createSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("createSection - PlanSectionLimitForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, ...tools.repeat(mocks.GenericPlanSectionCreatedEvent, 5)],
      deps,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionLimitForPlan.error,
    );
  });

  test("createSection - PlanSectionNameIsUniqueForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() => plan.createSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionNameIsUniqueForPlan.error,
    );
  });

  test("renameSection", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionRenamedEvent]);
  });

  test("renameSection - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("renameSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("renameSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.renameSection(mocks.planSectionId, mocks.anotherPlanSectionName, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("renameSection - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.renameSection(mocks.anotherPlanSectionId, mocks.anotherPlanSectionName, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("renameSection - PlanSectionNameIsUniqueForPlan", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() => plan.renameSection(mocks.planSectionId, mocks.planSectionName, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionNameIsUniqueForPlan.error,
    );
  });

  test("removeSection", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.removeSection(mocks.planSectionId, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionRemovedEvent]);
  });

  test("removeSection - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("removeSection - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() => plan.removeSection(mocks.planSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("removeSection - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.removeSection(mocks.planSectionId, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("removeSection - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() => plan.removeSection(mocks.anotherPlanSectionId, mocks.userId)).toThrow(
      Plans.Invariants.PlanSectionExists.error,
    );
  });

  test("archive - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.archive(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanArchivedEvent]);
  });

  test("archive - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.archive(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanArchivedEvent]);
  });

  test("archive - PlanIsArchivable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.archive(mocks.userId)).toThrow(Plans.Invariants.PlanIsArchivable.error);
  });

  test("archive - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.archive(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("finalize", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.finalize(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanFinalizedEvent]);
  });

  test("finalize - PlanHasSections", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanHasSections.error);
  });

  test("finalize - PlanHasNoEmptySections", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanHasNoEmptySections.error);
  });

  test("finalize - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("finalize - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() => plan.finalize(mocks.userId)).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("finalize - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.finalize(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("restore", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.restore(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRestoredEvent]);
  });

  test("restore - PlanIsRestorable - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("restore - PlanIsArchivable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() => plan.restore(mocks.userId)).toThrow(Plans.Invariants.PlanIsRestorable.error);
  });

  test("restore - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.restore(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("enableEditing", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () => plan.enableEditing(mocks.userId));

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanEditingEnabledEvent]);
  });

  test("enableEditing - PlanIsFinalized - draft", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.enableEditing(mocks.userId)).toThrow(Plans.Invariants.PlanIsFinalized.error);
  });

  test("enableEditing - PlanIsFinalized - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.enableEditing(mocks.userId)).toThrow(Plans.Invariants.PlanIsFinalized.error);
  });

  test("enableEditing - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() => plan.enableEditing(mocks.anotherUserId)).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("rename", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.rename(mocks.anotherPlanName, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanRenamedEvent]);
  });

  test("rename - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() => plan.rename(mocks.anotherPlanName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("rename - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() => plan.rename(mocks.anotherPlanName, mocks.userId)).toThrow(
      Plans.Invariants.PlanIsEditable.error,
    );
  });

  test("rename - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.rename(mocks.anotherPlanName, mocks.anotherUserId)).toThrow(
      Plans.Invariants.PlanBelongsToUser.error,
    );
  });

  test("rename - PlanNameHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() => plan.rename(mocks.planName, mocks.userId)).toThrow(
      Plans.Invariants.PlanNameHasChanged.error,
    );
  });

  test("addSectionExerciseInstruction - first", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionAddedEvent]);
  });

  test("addSectionExerciseInstruction - at the limit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        ...tools.repeat(mocks.GenericPlanSectionExerciseInstructionAddedEvent, 19),
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionAddedEvent]);
  });

  test("addSectionExerciseInstruction - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("addSectionExerciseInstruction - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("addSectionExerciseInstruction - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("addSectionExerciseInstruction - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.anotherPlanSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("addSectionExerciseInstruction - PlanSectionExerciseInstructionLimit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        ...tools.repeat(mocks.GenericPlanSectionExerciseInstructionAddedEvent, 20),
      ],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionLimit.error);
  });

  test("removeSectionExerciseInstruction", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.removeSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstructionId, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionRemovedEvent]);
  });

  test("removeSectionExerciseInstruction - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() =>
      plan.removeSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstructionId, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("removeSectionExerciseInstruction - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() =>
      plan.removeSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstructionId, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("removeSectionExerciseInstruction - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.removeSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherUserId,
      ),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("removeSectionExerciseInstruction - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.removeSectionExerciseInstruction(
        mocks.anotherPlanSectionId,
        mocks.exerciseInstructionId,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("removeSectionExerciseInstruction - PlanSectionExerciseInstructionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    expect(() =>
      plan.removeSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionId,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExists.error);
  });

  test("updateSectionExerciseInstruction", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.updateSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstruction,
        mocks.userId,
      ),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionUpdatedEvent]);
  });

  test("updateSectionExerciseInstruction - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() =>
      plan.updateSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstruction,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("updateSectionExerciseInstruction - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() =>
      plan.updateSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstruction,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("updateSectionExerciseInstruction - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.updateSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstruction,
        mocks.anotherUserId,
      ),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("updateSectionExerciseInstruction - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.updateSectionExerciseInstruction(
        mocks.anotherPlanSectionId,
        mocks.anotherExerciseInstruction,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("updateSectionExerciseInstruction - PlanSectionExerciseInstructionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    expect(() =>
      plan.updateSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndId,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExists.error);
  });

  test("updateSectionExerciseInstruction - PlanSectionExerciseInstructionHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    expect(() =>
      plan.updateSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionHasChanged.error);
  });

  test("changeSectionExerciseInstructionExercise", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndExercise,
        mocks.userId,
      ),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionExerciseChangedEvent]);
  });

  test("changeSectionExerciseInstructionExercise - PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndExercise,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("changeSectionExerciseInstructionExercise - PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndExercise,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("changeSectionExerciseInstructionExercise - PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndExercise,
        mocks.anotherUserId,
      ),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("changeSectionExerciseInstructionExercise - PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.anotherPlanSectionId,
        mocks.anotherExerciseInstructionAndExercise,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("changeSectionExerciseInstructionExercise - PlanSectionExerciseInstructionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    expect(() =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndId,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExists.error);
  });

  test("changeSectionExerciseInstructionExercise - PlanSectionExerciseInstructionExerciseHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    expect(() =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.exerciseInstruction,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExerciseHasChanged.error);
  });
});
