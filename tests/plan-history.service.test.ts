import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import * as mocks from "./mocks";

describe("PlanHistory", () => {
  test("calculate - plan created", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_CREATED_EVENT",
          details: { planName: mocks.planName },
          sequence: tools.Int.nonNegative(0),
          createdAt: mocks.T0.ms,
        },
      ],
      next: null,
    });
  });

  test("calculate - plan renamed", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanRenamedEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_RENAMED_EVENT",
          details: { planName: mocks.anotherPlanName },
          sequence: tools.Int.nonNegative(1),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(1),
    });
  });

  test("calculate - plan description set", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanDescriptionSetEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_DESCRIPTION_SET_EVENT",
          details: { text: mocks.planDescription },
          sequence: tools.Int.nonNegative(1),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(1),
    });
  });

  test("calculate - plan description cleared", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanDescriptionUnsetEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_DESCRIPTION_SET_EVENT",
          details: { text: null },
          sequence: tools.Int.nonNegative(1),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(1),
    });
  });

  test("calculate - plan finalized", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanFinalizedEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_FINALIZED_EVENT",
          details: {},
          sequence: tools.Int.nonNegative(1),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(1),
    });
  });

  test("calculate - section created", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanSectionCreatedEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_CREATED_EVENT",
          details: { sectionName: mocks.planSectionName },
          sequence: tools.Int.nonNegative(1),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(1),
    });
  });

  test("calculate - section renamed", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionRenamedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_RENAMED_EVENT",
          details: { sectionName: mocks.anotherPlanSectionName },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - section renamed - later entry", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionRenamedEvent,
        mocks.GenericPlanSectionRemovedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_REMOVED_EVENT",
          details: { sectionName: mocks.anotherPlanSectionName },
          sequence: tools.Int.nonNegative(3),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(3),
    });
  });

  test("calculate - section removed", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionRemovedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_REMOVED_EVENT",
          details: { sectionName: mocks.planSectionName },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - section warmup set", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionWarmupSetEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_WARMUP_SET_EVENT",
          details: { sectionName: mocks.planSectionName, text: mocks.planSectionWarmup },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - section warmup cleared", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionWarmupUnsetEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_WARMUP_SET_EVENT",
          details: { sectionName: mocks.planSectionName, text: null },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - section cooldown set", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionCooldownSetEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_COOLDOWN_SET_EVENT",
          details: { sectionName: mocks.planSectionName, text: mocks.planSectionCooldown },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - section cooldown cleared", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionCooldownUnsetEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_COOLDOWN_SET_EVENT",
          details: { sectionName: mocks.planSectionName, text: null },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - exercise instruction added", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
          details: {
            sectionName: mocks.planSectionName,
            exerciseName: mocks.exerciseName,
            prescription: { sets: mocks.sets, reps: mocks.repsRange, progression: mocks.progression },
          },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - exercise instruction added - rir", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEventRir,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
          details: {
            sectionName: mocks.planSectionName,
            exerciseName: mocks.exerciseName,
            prescription: {
              sets: mocks.sets,
              reps: mocks.repsRange,
              progression: mocks.progression,
              rir: mocks.rirTarget,
            },
          },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - exercise instruction added - unknown exercise", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
      ],
      exercises: [],
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
          details: {
            sectionName: mocks.planSectionName,
            exerciseName: null,
            prescription: { sets: mocks.sets, reps: mocks.repsRange, progression: mocks.progression },
          },
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(2),
    });
  });

  test("calculate - exercise instruction updated", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionUpdatedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT",
          details: {
            sectionName: mocks.planSectionName,
            exerciseName: mocks.exerciseName,
            prescription: {
              sets: mocks.anotherSets,
              reps: mocks.anotherRepsRange,
              progression: mocks.progression,
            },
          },
          sequence: tools.Int.nonNegative(3),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(3),
    });
  });

  test("calculate - exercise instruction exercise changed", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionExerciseChangedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT",
          details: { sectionName: mocks.planSectionName, exerciseName: mocks.anotherExerciseName },
          sequence: tools.Int.nonNegative(3),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(3),
    });
  });

  test("calculate - exercise instruction exercise changed - later entry", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionExerciseChangedEvent,
        mocks.GenericPlanSectionExerciseInstructionRemovedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT",
          details: { sectionName: mocks.planSectionName, exerciseName: mocks.anotherExerciseName },
          sequence: tools.Int.nonNegative(4),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(4),
    });
  });

  test("calculate - exercise instruction moved", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionMovedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT",
          details: {
            sectionName: mocks.planSectionName,
            exerciseName: mocks.exerciseName,
            position: mocks.anotherExerciseInstructionPosition,
          },
          sequence: tools.Int.nonNegative(3),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(3),
    });
  });

  test("calculate - exercise instruction removed", () => {
    const history = new Plans.Services.PlanHistory({
      events: [
        mocks.GenericPlanCreatedEvent,
        mocks.GenericPlanSectionCreatedEvent,
        mocks.GenericPlanSectionExerciseInstructionAddedEvent,
        mocks.GenericPlanSectionExerciseInstructionRemovedEvent,
      ],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({
      entries: [
        {
          name: "PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT",
          details: { sectionName: mocks.planSectionName, exerciseName: mocks.exerciseName },
          sequence: tools.Int.nonNegative(3),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(3),
    });
  });

  test("calculate - first page", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanRenamedEvent, mocks.GenericPlanFinalizedEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(2) })).toEqual({
      entries: [
        {
          name: "PLAN_FINALIZED_EVENT",
          details: {},
          sequence: tools.Int.nonNegative(2),
          createdAt: mocks.T0.ms,
        },
        {
          name: "PLAN_RENAMED_EVENT",
          details: { planName: mocks.anotherPlanName },
          sequence: tools.Int.nonNegative(1),
          createdAt: mocks.T0.ms,
        },
      ],
      next: tools.Int.nonNegative(1),
    });
  });

  test("calculate - next page", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanRenamedEvent, mocks.GenericPlanFinalizedEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ cursor: tools.Int.nonNegative(1), limit: tools.Int.positive(2) })).toEqual({
      entries: [
        {
          name: "PLAN_CREATED_EVENT",
          details: { planName: mocks.planName },
          sequence: tools.Int.nonNegative(0),
          createdAt: mocks.T0.ms,
        },
      ],
      next: null,
    });
  });

  test("calculate - exact page", () => {
    const history = new Plans.Services.PlanHistory({
      events: [mocks.GenericPlanCreatedEvent, mocks.GenericPlanRenamedEvent],
      exercises: mocks.planHistoryExercises,
    });

    expect(history.calculate({ limit: tools.Int.positive(2) })).toEqual({
      entries: [
        {
          name: "PLAN_RENAMED_EVENT",
          details: { planName: mocks.anotherPlanName },
          sequence: tools.Int.nonNegative(1),
          createdAt: mocks.T0.ms,
        },
        {
          name: "PLAN_CREATED_EVENT",
          details: { planName: mocks.planName },
          sequence: tools.Int.nonNegative(0),
          createdAt: mocks.T0.ms,
        },
      ],
      next: null,
    });
  });

  test("calculate - empty", () => {
    const history = new Plans.Services.PlanHistory({ events: [], exercises: mocks.planHistoryExercises });

    expect(history.calculate({ limit: tools.Int.positive(1) })).toEqual({ entries: [], next: null });
  });
});
