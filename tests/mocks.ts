// cspell:disable
import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { Session, User } from "better-auth";
import * as v from "valibot";
import * as Auth from "+auth";
import * as Exercises from "+exercises";
import { languages } from "+languages";
import * as Plans from "+plans";
import type * as Preferences from "+preferences";
import * as Stats from "+stats";
import * as Workouts from "+workouts";

// IDs
export const correlationId = v.parse(bg.CorrelationId, "00000000-0000-0000-0000-000000000000");

export const commit = bg.CommitSha.fromString("a".repeat(40)).value;
export const revision = new tools.Revision(0);

export const userId = v.parse(bg.UUID, "592ddbc7-9d8f-4677-9f7c-14d88800eea7");
export const anotherUserId = v.parse(bg.UUID, "c9371ccb-b4dd-4f4c-a03e-3bd9fcba816a");
export const historyId = v.parse(bg.UUID, "bd639ce1-155b-4a99-b423-0c41eaa0e330");
export const temporaryFileId = v.parse(bg.UUID, "738d1d64-0828-437e-a979-3dcebafe841a");

// Timestamps
export const T0 = tools.Timestamp.fromInstant(Temporal.Instant.from("2025-01-01T00:00:00Z"));
export const T0Date = "Wed, 01 Jan 2025 00:00:00 GMT";

export const T1 = tools.Timestamp.fromInstant(Temporal.Instant.from("2025-01-02T00:00:00Z"));

export const hourHasPassedTimestamp = T0;

export const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = { server: { requestIP: () => ({ address: "127.0.0.1" }) } };

export const email = v.parse(tools.Email, "user@example.com");
export const contact = { type: "email", address: email } as const;
export const anotherEmail = "another@example.com";

export const revisionHeaders = (revision = 0) => ({
  "if-match": `W/${v.parse(tools.RevisionValue, revision)}`,
});
export const correlationIdHeaders = { "correlation-id": correlationId };
export const correlationIdAndRevisionHeaders = (revision = 0) => ({
  "if-match": `W/${v.parse(tools.RevisionValue, revision)}`,
  "correlation-id": correlationId,
});

export const exerciseId = v.parse(Exercises.VO.ExerciseId, "723c1e17-b97f-4b58-8a11-55f9e20ad065");
export const exerciseName = v.parse(Exercises.VO.ExerciseName, "Bench Press Barbell Horizontal");
export const exerciseDescription = v.parse(
  Exercises.VO.ExerciseDescription,
  "Press the barbell upwards, while lying on the horizontal bench.",
);
export const exerciseImageKey = v.parse(tools.ObjectKey, `exercises/${exerciseId}/original.webp`);

export const anotherExerciseId = v.parse(Exercises.VO.ExerciseId, "5cd386ef-8f86-4ead-b845-d69159e2aeb0");

export const anotherExerciseName = v.parse(Exercises.VO.ExerciseName, "Horizontal Bench Press Barbell");
export const anotherExerciseDescription = v.parse(
  Exercises.VO.ExerciseDescription,
  "Press the barbell upwards, while lying on the bench.",
);
export const anotherExerciseImageKey = v.parse(tools.ObjectKey, `exercises/${exerciseId}/original.webp`);

export const exercise: Exercises.VO.Exercise = {
  id: exerciseId,
  name: exerciseName,
  description: exerciseDescription,
  image: exerciseImageKey,
};

export const exerciseCategoryId = v.parse(
  Exercises.VO.ExerciseCategoryId,
  "b1c4b703-c124-4153-ade8-c0587851334b",
);
export const exerciseCategoryName = v.parse(Exercises.VO.ExerciseCategoryName, "Upper Chest");

export const anotherExerciseCategoryId = v.parse(
  Exercises.VO.ExerciseCategoryId,
  "bb59c1dd-ffd6-416d-9123-a4cd1c508065",
);
export const anotherExerciseCategoryName = v.parse(Exercises.VO.ExerciseCategoryName, "Chest Upper");

export const exerciseCategory: Exercises.VO.ExerciseCategory = {
  id: exerciseCategoryId,
  name: exerciseCategoryName,
};

export const anotherExerciseCategory: Exercises.VO.ExerciseCategory = {
  id: anotherExerciseCategoryId,
  name: anotherExerciseCategoryName,
};

export const exerciseWithCategories: Exercises.VO.ExerciseWithCategories = {
  ...exercise,
  categories: [exerciseCategory],
};

export const planId = v.parse(Plans.VO.PlanId, "8e9ec237-fe50-4a77-b917-54e1d3bf9eec");
export const planName = v.parse(Plans.VO.PlanName, "PPL");

export const anotherPlanName = v.parse(Plans.VO.PlanName, "Push Pull Legs");

export const planSectionId = v.parse(Plans.VO.PlanSectionId, "a47013e9-23b1-4ce5-ab1e-eb95e5399636");
export const planSectionName = v.parse(Plans.VO.PlanSectionName, "Push");

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

export const sets = v.parse(Plans.VO.Sets, 3);
export const anotherSets = v.parse(Plans.VO.Sets, 4);

export const reps = v.parse(Plans.VO.Reps, { min: 8, max: 12 });
export const anotherReps = v.parse(Plans.VO.Reps, { min: 6, max: 6 });

export const exerciseInstruction: Plans.VO.ExerciseInstructionType = {
  id: exerciseInstructionId,
  exerciseId,
  reps,
  sets,
};

export const anotherExerciseInstruction: Plans.VO.ExerciseInstructionType = {
  id: exerciseInstructionId,
  exerciseId,
  reps: anotherReps,
  sets: anotherSets,
};

export const anotherExerciseInstructionAndExercise: Pick<
  Plans.VO.ExerciseInstructionType,
  "id" | "exerciseId"
> = { id: exerciseInstructionId, exerciseId: anotherExerciseId };

export const anotherExerciseInstructionAndId: Plans.VO.ExerciseInstructionType = {
  id: anotherExerciseInstructionId,
  exerciseId,
  reps: anotherReps,
  sets: anotherSets,
};

export const anotherExerciseInstructionAndIdAndExercise: Plans.VO.ExerciseInstructionType = {
  id: anotherExerciseInstructionId,
  exerciseId: anotherExerciseId,
  reps: anotherReps,
  sets: anotherSets,
};

export const etag = bg.Hash.fromString("0000000000000000000000000000000000000000000000000000000000000000");

export const head = {
  exists: true,
  etag,
  size: tools.Size.fromBytes(1234),
  lastModified: T0,
  mime: tools.Mimes.webp.mime,
};

export const profileAvatarObjectKey = v.parse(tools.ObjectKey, `users/${userId}/avatar.webp`);

// Streams
export const passageOfTimeStream = v.parse(bg.EventStream, "passage_of_time");
export const userStream = v.parse(bg.EventStream, `user_${userId}`);
export const accountStream = v.parse(bg.EventStream, `account_${userId}`);
export const preferencesStream = v.parse(bg.EventStream, `preferences_${userId}`);
export const exerciseStream = v.parse(bg.EventStream, `exercise_${exerciseId}`);
export const exerciseCategoryStream = v.parse(bg.EventStream, `exercise_category_${exerciseCategoryId}`);
export const planSummary: Plans.VO.PlanSummary = {
  id: planId,
  name: planName,
  status: Plans.VO.PlanStatusEnum.draft,
  revision: revision.value,
};
const planSection: Plans.VO.PlanSectionWithExercises = {
  id: planSectionId,
  name: planSectionName,
  exerciseInstructions: [
    { id: exerciseInstruction.id, exercise, sets: exerciseInstruction.sets, reps: exerciseInstruction.reps },
  ],
};
const anotherPlanSection: Plans.VO.PlanSectionWithExercises = {
  id: anotherPlanSectionId,
  name: anotherPlanSectionName,
  exerciseInstructions: [
    {
      id: anotherExerciseInstructionAndId.id,
      exercise,
      sets: anotherExerciseInstructionAndId.sets,
      reps: anotherExerciseInstructionAndId.reps,
    },
  ],
};

export const planSectionAtInstructionLimit: Plans.VO.PlanSectionWithExercises = {
  id: planSectionId,
  name: planSectionName,
  exerciseInstructions: Array.from({ length: Plans.VO.PlanSectionExerciseInstructionLimitMax }, () => ({
    id: v.parse(Plans.VO.ExerciseInstructionId, crypto.randomUUID()),
    exercise,
    sets: exerciseInstruction.sets,
    reps: exerciseInstruction.reps,
  })),
};

export const plan: Plans.VO.Plan = {
  id: planId,
  name: planName,
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
        remove: { available: true, enabled: true, hints: [] },
      },
    })),
    actions: { exerciseInstructionAdd: { available: true, enabled: true, hints: [] } },
  })),
};

export const planStream = v.parse(bg.EventStream, `plan_${planId}`);

export const workoutId = v.parse(Workouts.VO.WorkoutId, "f1c4b0a2-6d3e-4f81-9a7c-2b5e8d0f3a64");
export const workoutStream = v.parse(bg.EventStream, `workout_${workoutId}`);

export const workoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-01");
export const anotherWorkoutScheduledFor = v.parse(Workouts.VO.WorkoutScheduledFor, "2025-01-08");

export const workoutExerciseId = v.parse(
  Workouts.VO.WorkoutExerciseId,
  "1d9b7f60-2c34-4a58-9e1b-7f0a3c5d6e21",
);

export const workoutSummary: Workouts.VO.WorkoutSummary = {
  id: workoutId,
  planId,
  planName,
  planSectionId,
  planSectionName,
  scheduledFor: workoutScheduledFor,
  status: Workouts.VO.WorkoutStatusEnum.draft,
  revision: revision.value,
};

export const anotherWorkoutExerciseId = v.parse(
  Workouts.VO.WorkoutExerciseId,
  "6b2e4a17-9c05-4d3f-8a61-0e7d2f4b5c93",
);

export const exercisePrescription = v.parse(Workouts.VO.ExercisePrescription, { sets, reps });

export const loggedSetId = v.parse(Workouts.VO.LoggedSetId, "5f1c9b7e-3a2d-4c8b-9e6f-1a2b3c4d5e6f");

export const anotherLoggedSetId = v.parse(Workouts.VO.LoggedSetId, "6a2d0c8f-4b3e-4d9c-8f7a-2b3c4d5e6f70");

export const loggedSet = v.parse(Workouts.VO.LoggedSet, {
  id: loggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const anotherLoggedSet = v.parse(Workouts.VO.LoggedSet, {
  id: anotherLoggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 2),
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const exerciseTarget = v.parse(Workouts.VO.ExerciseTarget, {
  sets,
  reps: v.parse(Workouts.VO.Reps, 9),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

export const workout: Workouts.VO.Workout = {
  id: workoutId,
  planId,
  planName,
  planSectionId,
  planSectionName,
  scheduledFor: workoutScheduledFor,
  status: Workouts.VO.WorkoutStatusEnum.in_progress,
  revision: revision.value,
  exercises: [
    {
      id: workoutExerciseId,
      exerciseId,
      exerciseName,
      prescription: exercisePrescription,
      target: exerciseTarget,
      loggedSets: [loggedSet],
    },
  ],
};

export const workoutWithExerciseActions: Workouts.Queries.WorkoutGetResponse["data"] = {
  ...workout,
  exercises: workout.exercises.map((exercise) => ({
    ...exercise,
    loggedSets: exercise.loggedSets.map((set) => ({
      ...set,
      actions: {
        correct: { available: true, enabled: true, hints: [] },
        remove: { available: true, enabled: true, hints: [] },
      },
    })),
    actions: {
      targetSet: { available: true, enabled: true, hints: [] },
      remove: { available: true, enabled: true, hints: [] },
      setLog: { available: false, enabled: false, hints: [] },
    },
  })),
};

export const GenericHourHasPassedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: passageOfTimeStream,
  version: 1,
  commit,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: hourHasPassedTimestamp.ms },
} satisfies bg.System.Events.HourHasPassedEventType;

export const GenericAccountCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: accountStream,
  version: 1,
  commit,
  name: "ACCOUNT_CREATED_EVENT",
  payload: { userId, timestamp: T0.ms },
} satisfies Auth.Events.AccountCreatedEventType;

export const GenericAccountDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: accountStream,
  version: 1,
  commit,
  name: "ACCOUNT_DELETED_EVENT",
  payload: { userId, timestamp: T0.ms },
} satisfies Auth.Events.AccountDeletedEventType;

export const GenericUserLanguageSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: preferencesStream,
  version: 1,
  commit,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: languages.supported.en },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericUserLanguageSetPLEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: preferencesStream,
  version: 1,
  commit,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: languages.supported.pl },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericProfileAvatarUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: preferencesStream,
  version: 1,
  commit,
  name: "PROFILE_AVATAR_UPDATED_EVENT",
  payload: { userId, key: profileAvatarObjectKey, etag: etag.get() },
} satisfies Preferences.Events.ProfileAvatarUpdatedEventType;

export const GenericProfileAvatarRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: preferencesStream,
  version: 1,
  commit,
  name: "PROFILE_AVATAR_REMOVED_EVENT",
  payload: { userId },
} satisfies Preferences.Events.ProfileAvatarRemovedEventType;

export const GenericExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_ADDED_EVENT",
  payload: {
    id: exerciseId,
    name: exerciseName,
    description: exerciseDescription,
    image: exerciseImageKey,
    userId: Auth.VO.SYSTEM_USER_ID,
  },
} satisfies Exercises.Events.ExerciseAddedEventType;

export const GenericExerciseDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_DELETED_EVENT",
  payload: { id: exerciseId, image: exerciseImageKey, requesterId: Auth.VO.SYSTEM_USER_ID },
} satisfies Exercises.Events.ExerciseDeletedEventType;

export const GenericExerciseUpdatedNameEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_UPDATED_EVENT",
  payload: {
    id: exerciseId,
    name: anotherExerciseName,
    description: exerciseDescription,
    requesterId: Auth.VO.SYSTEM_USER_ID,
  },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseUpdatedDescriptionEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_UPDATED_EVENT",
  payload: {
    id: exerciseId,
    name: exerciseName,
    description: anotherExerciseDescription,
    requesterId: Auth.VO.SYSTEM_USER_ID,
  },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_UPDATED_EVENT",
  payload: {
    id: exerciseId,
    name: anotherExerciseName,
    description: anotherExerciseDescription,
    requesterId: Auth.VO.SYSTEM_USER_ID,
  },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseImageChangedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_IMAGE_CHANGED_EVENT",
  payload: { id: exerciseId, image: exerciseImageKey, requesterId: Auth.VO.SYSTEM_USER_ID },
} satisfies Exercises.Events.ExerciseImageChangedEventType;

export const GenericExerciseCategoryAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseCategoryStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_ADDED_EVENT",
  payload: { id: exerciseCategoryId, name: exerciseCategoryName, userId: Auth.VO.SYSTEM_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryAddedEventType;

export const GenericExerciseCategoryDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseCategoryStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_DELETED_EVENT",
  payload: { id: exerciseCategoryId, requesterId: Auth.VO.SYSTEM_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryDeletedEventType;

export const GenericExerciseCategoryRenamedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseCategoryStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_RENAMED_EVENT",
  payload: { id: exerciseCategoryId, name: anotherExerciseCategoryName, requesterId: Auth.VO.SYSTEM_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryRenamedEventType;

export const GenericExerciseCategoryAssignedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_ASSIGNED_EVENT",
  payload: { exerciseId, exerciseCategoryId, requesterId: Auth.VO.SYSTEM_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryAssignedEventType;

export const GenericExerciseCategoryUnassignedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: exerciseStream,
  version: 1,
  commit,
  name: "EXERCISE_CATEGORY_UNASSIGNED_EVENT",
  payload: { exerciseId, exerciseCategoryId, requesterId: Auth.VO.SYSTEM_USER_ID },
} satisfies Exercises.Events.ExerciseCategoryUnassignedEventType;

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

export const GenericPlanSectionExerciseInstructionAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
  payload: { planId, planSectionId, exerciseInstruction, requesterId: userId },
} satisfies Plans.Events.PlanSectionExerciseInstructionAddedEventType;

export const GenericPlanSectionExerciseInstructionAddedEventSecond = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstruction: anotherExerciseInstructionAndIdAndExercise,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionAddedEventType;

export const GenericPlanSectionExerciseInstructionAddedEventThird = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_ADDED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstruction: anotherExerciseInstructionAndId,
    requesterId: userId,
  },
} satisfies Plans.Events.PlanSectionExerciseInstructionAddedEventType;

export const GenericAnotherPlanSectionExerciseInstructionAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: planStream,
  version: 1,
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
  version: 1,
  commit,
  name: "PLAN_SECTION_EXERCISE_INSTRUCTION_UPDATED_EVENT",
  payload: {
    planId,
    planSectionId,
    exerciseInstruction: { id: exerciseInstructionId, reps: anotherReps, sets: anotherSets },
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

export const GenericWorkoutCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_CREATED_EVENT",
  payload: {
    workoutId,
    planId,
    planName,
    planSectionId,
    planSectionName,
    scheduledFor: workoutScheduledFor,
    userId,
  },
} satisfies Workouts.Events.WorkoutCreatedEventType;

export const GenericWorkoutExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_ADDED_EVENT",
  payload: {
    workoutId,
    workoutExerciseId,
    exerciseId,
    exerciseName,
    prescription: exercisePrescription,
    requesterId: userId,
  },
} satisfies Workouts.Events.WorkoutExerciseAddedEventType;

export const workoutExerciseAddedEvent = (): Workouts.Events.WorkoutExerciseAddedEventType => ({
  ...GenericWorkoutExerciseAddedEvent,
  payload: {
    ...GenericWorkoutExerciseAddedEvent.payload,
    workoutExerciseId: v.parse(Workouts.VO.WorkoutExerciseId, crypto.randomUUID()),
  },
});

export const AnotherGenericWorkoutExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_ADDED_EVENT",
  payload: {
    workoutId,
    workoutExerciseId: anotherWorkoutExerciseId,
    exerciseId,
    exerciseName,
    prescription: exercisePrescription,
    requesterId: userId,
  },
} satisfies Workouts.Events.WorkoutExerciseAddedEventType;

export const GenericWorkoutExerciseRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_REMOVED_EVENT",
  payload: { workoutId, workoutExerciseId, requesterId: userId },
} satisfies Workouts.Events.WorkoutExerciseRemovedEventType;

export const GenericWorkoutExerciseTargetSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_EXERCISE_TARGET_SET_EVENT",
  payload: { workoutId, workoutExerciseId, target: exerciseTarget, requesterId: userId },
} satisfies Workouts.Events.WorkoutExerciseTargetSetEventType;

export const GenericWorkoutStartedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_STARTED_EVENT",
  payload: { workoutId, requesterId: userId },
} satisfies Workouts.Events.WorkoutStartedEventType;

export const GenericWorkoutSetLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_LOGGED_EVENT",
  payload: { workoutId, workoutExerciseId, exerciseId, loggedSet, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetLoggedEventType;

export const correctedLoggedSet = v.parse(Workouts.VO.LoggedSet, {
  id: loggedSetId,
  setNumber: v.parse(Workouts.VO.SetNumber, 1),
  reps: v.parse(Workouts.VO.Reps, 6),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(85).get()),
});

export const GenericWorkoutSetCorrectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_CORRECTED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSet: correctedLoggedSet, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetCorrectedEventType;

export const GenericWorkoutSetRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_REMOVED_EVENT",
  payload: { workoutId, workoutExerciseId, loggedSetId, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetRemovedEventType;

export const GenericWorkoutCompletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_COMPLETED_EVENT",
  payload: { workoutId, requesterId: userId },
} satisfies Workouts.Events.WorkoutCompletedEventType;

export const GenericWorkoutDiscardedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_DISCARDED_EVENT",
  payload: { workoutId, requesterId: userId },
} satisfies Workouts.Events.WorkoutDiscardedEventType;

export const workoutNote = v.parse(Workouts.VO.WorkoutNote, "Felt heavy, dropped to 80kg on set 3");

export const GenericWorkoutNoteSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_NOTE_SET_EVENT",
  payload: { workoutId, note: workoutNote, requesterId: userId },
} satisfies Workouts.Events.WorkoutNoteSetEventType;

export const GenericWorkoutNoteUnsetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_NOTE_SET_EVENT",
  payload: { workoutId, note: undefined, requesterId: userId },
} satisfies Workouts.Events.WorkoutNoteSetEventType;

export const GenericWorkoutRescheduledEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_RESCHEDULED_EVENT",
  payload: { workoutId, scheduledFor: anotherWorkoutScheduledFor, requesterId: userId },
} satisfies Workouts.Events.WorkoutRescheduledEventType;

export const AnotherGenericWorkoutSetLoggedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: workoutStream,
  version: 1,
  commit,
  name: "WORKOUT_SET_LOGGED_EVENT",
  payload: { workoutId, workoutExerciseId, exerciseId, loggedSet: anotherLoggedSet, requesterId: userId },
} satisfies Workouts.Events.WorkoutSetLoggedEventType;

export const exerciseSession = {
  workoutId,
  completedAt: T0.ms,
  sets: [{ reps: loggedSet.reps, load: loggedSet.load }],
} satisfies Stats.VO.ExerciseSession;

export const exerciseRecord = {
  reps: loggedSet.reps,
  load: loggedSet.load,
  workoutId,
  completedAt: T0.ms,
} satisfies Stats.VO.ExerciseRecord;

export const singleRepSet = {
  reps: v.parse(Workouts.VO.Reps, 1),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
} satisfies Stats.VO.PerformedSet;

export const fiveRepSet = {
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
} satisfies Stats.VO.PerformedSet;

export const eightRepSet = {
  reps: v.parse(Workouts.VO.Reps, 8),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(15).get()),
} satisfies Stats.VO.PerformedSet;

export const fifteenRepSet = {
  reps: v.parse(Workouts.VO.Reps, 15),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(40).get()),
} satisfies Stats.VO.PerformedSet;

export const repLimitSet = {
  reps: v.parse(Workouts.VO.Reps, Stats.Ports.ONE_REP_MAX_REPS_LIMIT),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
} satisfies Stats.VO.PerformedSet;

export const aboveRepLimitSet = {
  reps: v.parse(Workouts.VO.Reps, Stats.Ports.ONE_REP_MAX_REPS_LIMIT + 1),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
} satisfies Stats.VO.PerformedSet;

export const user = {
  name: email,
  email,
  emailVerified: false,
  image: null,
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: new Date(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: new Date(),
  id: userId,
} satisfies User;

export const anotherUser = {
  name: anotherEmail,
  email: anotherEmail,
  emailVerified: false,
  image: null,
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: new Date(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: new Date(),
  id: anotherUserId,
} satisfies User;

export const session: Session = {
  // biome-ignore lint: lint/style/noRestrictedGlobals
  expiresAt: new Date(),
  token: "wyNm82TTSvBtxXSh1mb7lZJ4WF557tv4",
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: new Date(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: new Date(),
  ipAddress: "",
  userAgent: "Mozilla/5.0",
  userId,
  id: "JUFCrqCBwFT3MCJV0mAVYSXtLJOkNBVN",
};

export const anotherSession: Session = {
  // biome-ignore lint: lint/style/noRestrictedGlobals
  expiresAt: new Date(),
  token: "XFgejTtN28QI8cDEmE9Yb09yxRwQuGj0",
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: new Date(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: new Date(),
  ipAddress: "",
  userAgent: "Mozilla/5.0",
  userId,
  id: "xXHd0LUChE6NiYnQXc8mwij7jjp5kUhs",
};

export const systemUser = {
  name: "system",
  email: "system@example.com",
  emailVerified: true,
  image: null,
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: new Date(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: new Date(),
  id: Auth.VO.SYSTEM_USER_ID,
} satisfies User;

export const systemSession: Session = {
  // biome-ignore lint: lint/style/noRestrictedGlobals
  expiresAt: new Date(),
  token: "TzXpNRK9dQmVbW4sJhLyCe2Ff7uAgQ3o",
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: new Date(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: new Date(),
  ipAddress: "",
  userAgent: "Mozilla/5.0",
  userId: Auth.VO.SYSTEM_USER_ID,
  id: "Kk3wR7pVn0aZsQdHtXmL6yBgUfCe9iJx",
};

export const auth = { user, session, path: "/get-session", options: {} } as const;

export const systemAuth = {
  user: systemUser,
  session: systemSession,
  path: "/get-session",
  options: {},
} as const;

export const anotherAuth = {
  user: anotherUser,
  session: anotherSession,
  path: "/get-session",
  options: {},
} as const;

export const IntentionalError = "intentional.error" as const;
export const throwIntentionalError = () => {
  throw new Error(IntentionalError);
};
export const throwIntentionalErrorAsync = async () => {
  throw new Error(IntentionalError);
};

export const stream = () => new ReadableStream({ start: (controller) => controller.close() });

export const png = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])], "image.png");
