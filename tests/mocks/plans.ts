// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Plans from "+plans";
import { userId } from "./auth";
import { anotherExerciseId, exercise, exerciseId } from "./exercises";
import { commit, correlationId, expectAnyId, revision, T0 } from "./shared";

export const planId = v.parse(Plans.VO.PlanId, "8e9ec237-fe50-4a77-b917-54e1d3bf9eec");
export const planName = v.parse(Plans.VO.PlanName, "PPL");

export const anotherPlanName = v.parse(Plans.VO.PlanName, "Push Pull Legs");

export const planSectionId = v.parse(Plans.VO.PlanSectionId, "a47013e9-23b1-4ce5-ab1e-eb95e5399636");
export const planSectionName = v.parse(Plans.VO.PlanSectionName, "Push");

export const planSectionWarmup = v.parse(
  Plans.VO.PlanSectionWarmup,
  "5 min bike, band pull-aparts 2x15, empty bar bench 2x10",
);

export const planSectionCooldown = v.parse(
  Plans.VO.PlanSectionCooldown,
  "Pec stretch 2x30s each side, lat hang 60s",
);

export const anotherPlanSectionId = v.parse(Plans.VO.PlanSectionId, "a792b3cd-e519-4db4-8b99-c0b18aadb44b");
export const anotherPlanSectionName = v.parse(Plans.VO.PlanSectionName, "Push A");
export const thirdPlanSectionId = v.parse(Plans.VO.PlanSectionId, "b0f0f0f7-6a0e-4c58-9a05-2f0c39e4a2f1");
export const thirdPlanSectionName = v.parse(Plans.VO.PlanSectionName, "Pull");

export const exerciseInstructionId = v.parse(
  Plans.VO.ExerciseInstructionId,
  "4c0dd7b6-4d7e-40ca-94cb-4c340d0b1daf",
);

export const anotherExerciseInstructionId = v.parse(
  Plans.VO.ExerciseInstructionId,
  "0dd8da64-d1a8-4904-8fbb-8835589b93e7",
);

export const exerciseInstructionPosition = v.parse(Plans.VO.ExerciseInstructionPosition, 0);
export const anotherExerciseInstructionPosition = v.parse(Plans.VO.ExerciseInstructionPosition, 1);

export const sets = v.parse(Plans.VO.Sets, 3);
export const anotherSets = v.parse(Plans.VO.Sets, 4);

export const progression = Plans.VO.ProgressionMethodOptions.double_progression;

export const reps = v.parse(Plans.VO.Reps, { min: 8, max: 12 });
export const anotherReps = v.parse(Plans.VO.Reps, { min: 6, max: 6 });

export const exerciseInstruction: Plans.VO.ExerciseInstructionType = {
  id: exerciseInstructionId,
  exerciseId,
  reps,
  sets,
  progression,
};

export const anotherExerciseInstruction: Plans.VO.ExerciseInstructionType = {
  id: exerciseInstructionId,
  exerciseId,
  reps: anotherReps,
  sets: anotherSets,
  progression,
};

export const anotherExerciseInstructionAndExercise: Pick<
  Plans.VO.ExerciseInstructionType,
  "id" | "exerciseId"
> = { id: exerciseInstructionId, exerciseId: anotherExerciseId };

export const otherExerciseInstruction: Plans.VO.ExerciseInstructionType = {
  id: anotherExerciseInstructionId,
  exerciseId,
  reps: anotherReps,
  sets: anotherSets,
  progression,
};

export const otherExerciseInstructionWithAnotherExercise: Plans.VO.ExerciseInstructionType = {
  id: anotherExerciseInstructionId,
  exerciseId: anotherExerciseId,
  reps: anotherReps,
  sets: anotherSets,
  progression,
};

export const planSummary: Plans.VO.PlanSummary = {
  id: planId,
  name: planName,
  description: null,
  status: Plans.VO.PlanStatusEnum.draft,
  revision: revision.value,
  updatedAt: T0.ms,
  sections: tools.Int.nonNegative(2),
};
const planSection: Plans.VO.PlanSectionWithExercises = {
  id: planSectionId,
  name: planSectionName,
  warmup: planSectionWarmup,
  cooldown: planSectionCooldown,
  exerciseInstructions: [
    {
      id: exerciseInstruction.id,
      exercise,
      sets: exerciseInstruction.sets,
      reps: exerciseInstruction.reps,
      progression,
    },
  ],
};
const anotherPlanSection: Plans.VO.PlanSectionWithExercises = {
  id: anotherPlanSectionId,
  name: anotherPlanSectionName,
  warmup: null,
  cooldown: null,
  exerciseInstructions: [
    {
      id: otherExerciseInstruction.id,
      exercise,
      sets: otherExerciseInstruction.sets,
      reps: otherExerciseInstruction.reps,
      progression,
    },
  ],
};

export const planSectionAtInstructionLimit: Plans.VO.PlanSectionWithExercises = {
  id: planSectionId,
  name: planSectionName,
  warmup: null,
  cooldown: null,
  exerciseInstructions: Array.from({ length: Plans.VO.PlanSectionExerciseInstructionLimitMax }, () => ({
    id: v.parse(Plans.VO.ExerciseInstructionId, crypto.randomUUID()),
    exercise,
    sets: exerciseInstruction.sets,
    reps: exerciseInstruction.reps,
    progression,
  })),
};

export const planSectionWithTwoExerciseInstructions: Plans.VO.PlanSectionWithExercises = {
  id: planSectionId,
  name: planSectionName,
  warmup: null,
  cooldown: null,
  exerciseInstructions: [...planSection.exerciseInstructions, ...anotherPlanSection.exerciseInstructions],
};

export const planSectionEmpty: Plans.VO.PlanSectionWithExercises = {
  id: anotherPlanSectionId,
  name: anotherPlanSectionName,
  warmup: null,
  cooldown: null,
  exerciseInstructions: [],
};

export const planSectionsAtLimit: ReadonlyArray<Plans.VO.PlanSectionWithExercises> = Array.from(
  { length: Plans.VO.PlanSectionLimitForPlanMax },
  () => planSection,
);

export const plan: Plans.VO.Plan = {
  id: planId,
  name: planName,
  description: null,
  status: Plans.VO.PlanStatusEnum.draft,
  revision: revision.value,
  updatedAt: T0.ms,
  sections: [planSection, anotherPlanSection],
};

export const planAtInstructionLimit: Plans.VO.Plan = {
  ...plan,
  sections: [planSectionAtInstructionLimit],
};

export const planWithSectionActions: Plans.Queries.PlanGetResponse["data"] = {
  ...plan,
  sections: plan.sections.map((section) => ({
    ...section,
    exerciseInstructions: section.exerciseInstructions.map((exerciseInstruction) => ({
      ...exerciseInstruction,
      actions: {
        update: { available: true, enabled: true, hints: [] },
        exerciseChange: { available: true, enabled: true, hints: [] },
        moveUp: { available: true, enabled: true, hints: [] },
        moveDown: { available: true, enabled: true, hints: [] },
        remove: { available: true, enabled: true, hints: [] },
      },
    })),
    actions: { exerciseInstructionAdd: { available: true, enabled: true, hints: [] } },
  })),
};

export const planStream = v.parse(bg.EventStream, `plan_${planId}`);

export const GenericPlanCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_CREATED_EVENT",
  payload: { planId, planName, userId },
} satisfies Plans.Events.PlanCreatedEventType;

export const GenericPlanSectionCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_CREATED_EVENT",
  payload: { planId, planSectionId, planSectionName, requesterId: userId },
} satisfies Plans.Events.PlanSectionCreatedEventType;

export const GenericPlanSectionCreatedEventSecond = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_CREATED_EVENT",
  payload: {
    planId,
    planSectionId: anotherPlanSectionId,
    planSectionName: anotherPlanSectionName,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionCreatedEventType;

export const GenericPlanSectionCreatedEventThird = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_CREATED_EVENT",
  payload: {
    planId,
    planSectionId: anotherPlanSectionId,
    planSectionName: thirdPlanSectionName,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionCreatedEventType;

export const GenericPlanSectionRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_REMOVED_EVENT",
  payload: { planId, planSectionId, requesterId: userId },
} satisfies Plans.Events.PlanSectionRemovedEventType;

export const GenericPlanSectionRenamedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_RENAMED_EVENT",
  payload: { planId, planSectionId, planSectionName: anotherPlanSectionName, requesterId: userId },
} satisfies Plans.Events.PlanSectionRenamedEventType;

export const GenericPlanSectionWarmupSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_WARMUP_SET_EVENT",
  payload: { planId, planSectionId, warmup: planSectionWarmup, requesterId: userId },
} satisfies Plans.Events.PlanSectionWarmupSetEventType;

export const GenericPlanSectionWarmupUnsetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_WARMUP_SET_EVENT",
  payload: { planId, planSectionId, warmup: undefined, requesterId: userId },
} satisfies Plans.Events.PlanSectionWarmupSetEventType;

export const GenericPlanSectionCooldownSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_COOLDOWN_SET_EVENT",
  payload: { planId, planSectionId, cooldown: planSectionCooldown, requesterId: userId },
} satisfies Plans.Events.PlanSectionCooldownSetEventType;

export const GenericPlanSectionCooldownUnsetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_COOLDOWN_SET_EVENT",
  payload: { planId, planSectionId, cooldown: undefined, requesterId: userId },
} satisfies Plans.Events.PlanSectionCooldownSetEventType;

export const GenericPlanArchivedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_ARCHIVED_EVENT",
  payload: { planId, requesterId: userId },
} satisfies Plans.Events.PlanArchivedEventType;

export const GenericPlanFinalizedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_FINALIZED_EVENT",
  payload: { planId, requesterId: userId },
} satisfies Plans.Events.PlanFinalizedEventType;

export const GenericPlanRestoredEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_RESTORED_EVENT",
  payload: { planId, requesterId: userId },
} satisfies Plans.Events.PlanRestoredEventType;

export const GenericPlanRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_REMOVED_EVENT",
  payload: { planId, requesterId: userId },
} satisfies Plans.Events.PlanRemovedEventType;

export const GenericPlanEditingEnabledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_EDITING_ENABLED_EVENT",
  payload: { planId, requesterId: userId },
} satisfies Plans.Events.PlanEditingEnabledEventType;

export const GenericPlanRenamedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_RENAMED_EVENT",
  payload: { planId, planName: anotherPlanName, requesterId: userId },
} satisfies Plans.Events.PlanRenamedEventType;

export const planDescription = v.parse(
  Plans.VO.PlanDescription,
  "Push/pull/legs, 3x a week, rest every 4th week",
);

export const GenericPlanDescriptionSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_DESCRIPTION_SET_EVENT",
  payload: { planId, description: planDescription, requesterId: userId },
} satisfies Plans.Events.PlanDescriptionSetEventType;

export const GenericPlanDescriptionUnsetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_DESCRIPTION_SET_EVENT",
  payload: { planId, description: undefined, requesterId: userId },
} satisfies Plans.Events.PlanDescriptionSetEventType;

export const GenericPlanSectionExerciseInstructionAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 2,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
  payload: { planId, planSectionId, exerciseInstruction, requesterId: userId },
} satisfies Plans.Events.PlanSectionExerciseInstructionAddedEventType;

export const GenericPlanSectionExerciseInstructionAddedEventSecond = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 2,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstruction: otherExerciseInstructionWithAnotherExercise,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionAddedEventType;

export const GenericPlanSectionExerciseInstructionAddedEventThird = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 2,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstruction: otherExerciseInstruction,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionAddedEventType;

export const GenericPlanSectionExerciseInstructionAddedEventAnother = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 2,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
  payload: {
    planId,
    planSectionId: anotherPlanSectionId,
    exerciseInstruction,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionAddedEventType;

export const GenericPlanSectionExerciseInstructionRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_REMOVED_EVENT",
  payload: { planId, planSectionId, exerciseInstructionId, requesterId: userId },
} satisfies Plans.Events.PlanSectionExerciseInstructionRemovedEventType;

export const GenericPlanSectionExerciseInstructionUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 2,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstruction: { id: exerciseInstructionId, reps: anotherReps, sets: anotherSets, progression },
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionUpdatedEventType;

export const GenericPlanSectionExerciseInstructionExerciseChangedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_EXERCISE_CHANGED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstruction: { id: exerciseInstructionId, exerciseId: anotherExerciseId },
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionExerciseChangedEventType;

export const GenericPlanSectionExerciseInstructionMovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_MOVED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstructionId,
    position: anotherExerciseInstructionPosition,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionMovedEventType;

export const planWithSectionHistory = [GenericPlanCreatedEvent, GenericPlanSectionCreatedEvent];

export const planWithExerciseInstructionHistory = [
  ...planWithSectionHistory,
  GenericPlanSectionExerciseInstructionAddedEvent,
];

export const planArchivedHistory = [GenericPlanCreatedEvent, GenericPlanArchivedEvent];

export const planFinalizedHistory = [GenericPlanCreatedEvent, GenericPlanFinalizedEvent];
