import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Plans from "+plans";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("Plan.updateSectionExerciseInstruction", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("PlanIsEditable - archived", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planArchivedHistory,
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

  test("PlanIsEditable - finalized", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      mocks.planFinalizedHistory,
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

  test("PlanBelongsToUser", async () => {
    const plan = Plans.Aggregates.Plan.build(mocks.planId, [mocks.GenericPlanCreatedEvent], deps);

    expect(() =>
      plan.updateSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstruction,
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
      plan.updateSectionExerciseInstruction(
        mocks.anotherPlanSectionId,
        mocks.anotherExerciseInstruction,
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
      plan.updateSectionExerciseInstruction(
        mocks.planSectionId,
        mocks.anotherExerciseInstruction,
        mocks.userId,
      ),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionExists.error);
  });

  test("PlanSectionExerciseInstructionHasChanged", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventThird,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );

    expect(() =>
      plan.updateSectionExerciseInstruction(mocks.planSectionId, mocks.exerciseInstruction, mocks.userId),
    ).toThrow(Plans.Invariants.PlanSectionExerciseInstructionHasChanged.error);
  });

  test("happy path", async () => {
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

  test("happy path - only the sets changed", async () => {
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
    const exerciseInstruction = {
      id: mocks.exerciseInstructionId,
      reps: mocks.reps,
      sets: mocks.anotherSets,
      progression: mocks.progression,
    };

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.updateSectionExerciseInstruction(mocks.planSectionId, exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([
      {
        ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent,
        payload: {
          ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent.payload,
          exerciseInstruction,
        },
      },
    ]);
    expect(plan.sections).toEqual([
      {
        id: mocks.planSectionId,
        name: mocks.planSectionName,
        exerciseInstructions: [
          { ...mocks.exerciseInstruction, sets: mocks.anotherSets },
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

  test("happy path - only the minimum reps changed", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );
    const exerciseInstruction = {
      id: mocks.exerciseInstructionId,
      reps: v.parse(Plans.VO.Reps, { min: mocks.reps.min - 1, max: mocks.reps.max }),
      sets: mocks.sets,
      progression: mocks.progression,
    };

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.updateSectionExerciseInstruction(mocks.planSectionId, exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([
      {
        ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent,
        payload: {
          ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent.payload,
          exerciseInstruction,
        },
      },
    ]);
  });

  test("happy path - only the maximum reps changed", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );
    const exerciseInstruction = {
      id: mocks.exerciseInstructionId,
      reps: v.parse(Plans.VO.Reps, { min: mocks.reps.min, max: mocks.reps.max + 1 }),
      sets: mocks.sets,
      progression: mocks.progression,
    };

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.updateSectionExerciseInstruction(mocks.planSectionId, exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([
      {
        ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent,
        payload: {
          ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent.payload,
          exerciseInstruction,
        },
      },
    ]);
  });

  test("happy path - only the progression changed", async () => {
    const plan = Plans.Aggregates.Plan.build(
      mocks.planId,
      [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      deps,
    );
    const exerciseInstruction = {
      id: mocks.exerciseInstructionId,
      reps: mocks.reps,
      sets: mocks.sets,
      progression: Plans.VO.ProgressionMethodOptions.linear_progression,
    };

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      plan.updateSectionExerciseInstruction(mocks.planSectionId, exerciseInstruction, mocks.userId),
    );

    expect(plan.pullEvents()).toEqual([
      {
        ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent,
        payload: {
          ...mocks.GenericPlanSectionExerciseInstructionUpdatedEvent.payload,
          exerciseInstruction,
        },
      },
    ]);
  });
});
