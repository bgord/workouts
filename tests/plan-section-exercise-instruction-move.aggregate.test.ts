import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.moveSectionExerciseInstruction", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planArchivedHistory,
      deps,
    );

    expect(() =>
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherExerciseInstructionPosition,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planFinalizedHistory,
      deps,
    );

    expect(() =>
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherExerciseInstructionPosition,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherExerciseInstructionPosition,
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
      plan.moveSectionExerciseInstruction(
        mocks.anotherPlanSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherExerciseInstructionPosition,
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
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.exerciseInstructionPosition,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExists.error);
  });

  test("PlanSectionExerciseInstructionPositionInRange", async () => {
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
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherExerciseInstructionPosition,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionPositionInRange.error);
  });

  test("PlanSectionExerciseInstructionPositionHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventThird,
      ],
      deps,
    );

    expect(() =>
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.exerciseInstructionPosition,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionPositionHasChanged.error);
  });

  test("happy path", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionCreatedEventSecond,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventThird,
        mocks.GenericPlanSectionExerciseInstructionAddedEventAnother,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.anotherExerciseInstructionPosition,
        mocks.userId,
      ),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionMovedEvent]);
    expect(plan.sections).toEqual([
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        exerciseInstructions: [mocks.otherExerciseInstruction, mocks.exerciseInstruction],
      },
      {
        id: mocks.anotherPlanSectionId,
        name: mocks.anotherPlanSectionName,
        exerciseInstructions: [mocks.exerciseInstruction],
      },
    ]);
  });

  test("happy path - back to the front", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventThird,
        mocks.GenericPlanSectionExerciseInstructionMovedEvent,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.moveSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.exerciseInstructionId,
        mocks.exerciseInstructionPosition,
        mocks.userId,
      ),
    );

    expect(plan.pullEvents()).toEqual([
      {
        ...mocks.GenericPlanSectionExerciseInstructionMovedEvent,
        payload: {
          ...mocks.GenericPlanSectionExerciseInstructionMovedEvent.payload,
          position: mocks.exerciseInstructionPosition,
        },
      },
    ]);
    expect(plan.sections).toEqual([
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        exerciseInstructions: [mocks.exerciseInstruction, mocks.otherExerciseInstruction],
      },
    ]);
  });
});
