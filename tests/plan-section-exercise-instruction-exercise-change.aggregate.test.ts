import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.changeSectionExerciseInstructionExercise", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
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

  test("PlanIsEditable - finalized", async () => {
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

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndExercise,
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
      plan.changeSectionExerciseInstructionExercise(
        mocks.anotherPlanSectionId,
        mocks.anotherExerciseInstructionAndExercise,
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
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndExercise,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExists.error);
  });

  test("PlanSectionExerciseInstructionExerciseHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventSecond,
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
      plan.changeSectionExerciseInstructionExercise(
        mocks.planSectionId,
        mocks.anotherExerciseInstructionAndExercise,
        mocks.userId,
      ),
    );

    expect(plan.pullEvents()).toEqual([mocks.GenericPlanSectionExerciseInstructionExerciseChangedEvent]);
    expect(plan.sections).toEqual([
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        exerciseInstructions: [
          { ...mocks.exerciseInstruction, exerciseId: mocks.anotherExerciseId },
          mocks.otherExerciseInstruction,
        ],
      },
      {
        id: mocks.anotherPlanSectionId,
        name: mocks.anotherPlanSectionName,
        exerciseInstructions: [mocks.exerciseInstruction],
      },
    ]);
  });
});
