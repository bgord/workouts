import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.addSectionExerciseInstruction", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanArchivedEvent],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanIsEditable.error);
  });

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.anotherUserId),
    ).toThrow(Plans.Invariants.PlanBelongsToUser.error);
  });

  test("PlanSectionExists", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.anotherPlanSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExists.error);
  });

  test("PlanSectionExerciseInstructionLimit", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEventSecond,
        mocks.GenericPlanSectionCreatedEvent,
        ...tools.repeat(mocks.GenericPlanSectionExerciseInstructionAddedEvent, 20),
      ],
      deps,
    );

    expect(() =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionLimit.error);
  });

  test("happy path - first", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionCreatedEventSecond,
      ],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.addSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionAddedEvent]);
    expect(plan.sections).toEqual([
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        exerciseInstructions: [mocks.exerciseInstruction],
      },
      { id: mocks.anotherPlanSectionId, name: mocks.anotherPlanSectionName, exerciseInstructions: [] },
    ]);
  });

  test("happy path - at the limit", async () => {
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
});
