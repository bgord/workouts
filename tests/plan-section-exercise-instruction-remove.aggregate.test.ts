import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.removeSectionExerciseInstruction", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planArchivedHistory,
      deps,
    );

    expect(() =>
      plan.removeSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstructionId, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planFinalizedHistory,
      deps,
    );

    expect(() =>
      plan.removeSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstructionId, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.removeSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherUserId,
      ),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("PlanSectionExists", async () => {
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

  test("PlanSectionExerciseInstructionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEventSecond,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventAnother,
        mocks.GenericPlanSectionExerciseInstructionAddedEventSecond,
      ],
      deps,
    );

    expect(() =>
      plan.removeSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstructionId, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExists.error);
  });

  test("happy path", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionCreatedEventSecond,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventSecond,
        mocks.GenericPlanSectionExerciseInstructionAddedEventAnother,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.removeSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstructionId, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionRemovedEvent]);
    expect(plan.sections).toEqual([
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        exerciseInstructions: [mocks.otherExerciseInstructionWithAnotherExercise],
      },
      {
        id: mocks.anotherPlanSectionId,
        name: mocks.anotherPlanSectionName,
        exerciseInstructions: [mocks.exerciseInstruction],
      },
    ]);
  });
});
