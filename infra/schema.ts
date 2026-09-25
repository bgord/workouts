/* cSpell:disable */

import type * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import { relations, sql } from "drizzle-orm";
import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import type { UserIdType } from "../modules/auth/value-objects/user-id";
import type { ExerciseCategoryIdType } from "../modules/exercises/value-objects/exercise-category-id";
import type { ExerciseCategoryNameType } from "../modules/exercises/value-objects/exercise-category-name";
import type { ExerciseDescriptionType } from "../modules/exercises/value-objects/exercise-description";
import type { ExerciseIdType } from "../modules/exercises/value-objects/exercise-id";
import type { ExerciseNameType } from "../modules/exercises/value-objects/exercise-name";
import type { BodyWeightType } from "../modules/measurements/value-objects/body-weight";
import type { BodyWeightGoalType } from "../modules/measurements/value-objects/body-weight-goal";
import { BodyWeightGoalOptions } from "../modules/measurements/value-objects/body-weight-goal-options";
import type { BodyWeightMeasuredOnType } from "../modules/measurements/value-objects/body-weight-measured-on";
import type { BodyWeightMeasurementIdType } from "../modules/measurements/value-objects/body-weight-measurement-id";
import { WeeklySummaryStatusEnum } from "../modules/notifications/value-objects/weekly-summary-status";
import type { ExerciseInstructionIdType } from "../modules/plans/value-objects/exercise-instruction-id";
import type { ExerciseInstructionPositionType } from "../modules/plans/value-objects/exercise-instruction-position";
import type { PlanDescriptionType } from "../modules/plans/value-objects/plan-description";
import type { PlanIdType } from "../modules/plans/value-objects/plan-id";
import type { PlanNameType } from "../modules/plans/value-objects/plan-name";
import type { PlanSectionCooldownType } from "../modules/plans/value-objects/plan-section-cooldown";
import type { PlanSectionIdType } from "../modules/plans/value-objects/plan-section-id";
import type { PlanSectionNameType } from "../modules/plans/value-objects/plan-section-name";
import type { PlanSectionWarmupType } from "../modules/plans/value-objects/plan-section-warmup";
import { PlanStatusEnum } from "../modules/plans/value-objects/plan-status";
import type { ProgressionMethodType } from "../modules/plans/value-objects/progression-method";
import { ProgressionMethodOptions } from "../modules/plans/value-objects/progression-method-options";
import type { RepsType as PlanRepsType } from "../modules/plans/value-objects/reps";
import type { SetsType } from "../modules/plans/value-objects/sets";
import type { ExercisePrescriptionType } from "../modules/workouts/value-objects/exercise-prescription";
import type { ExerciseTargetType } from "../modules/workouts/value-objects/exercise-target";
import type { LoadType } from "../modules/workouts/value-objects/load";
import type { LoggedSetIdType } from "../modules/workouts/value-objects/logged-set-id";
import type { RepsType as WorkoutRepsType } from "../modules/workouts/value-objects/reps";
import type { RirType } from "../modules/workouts/value-objects/rir";
import type { SetNumberType } from "../modules/workouts/value-objects/set-number";
import type { WorkoutExerciseIdType } from "../modules/workouts/value-objects/workout-exercise-id";
import type { WorkoutExercisePositionType } from "../modules/workouts/value-objects/workout-exercise-position";
import type { WorkoutIdType } from "../modules/workouts/value-objects/workout-id";
import type { WorkoutNoteType } from "../modules/workouts/value-objects/workout-note";
import type { WorkoutScheduledForType } from "../modules/workouts/value-objects/workout-scheduled-for";
import { WorkoutStatusEnum } from "../modules/workouts/value-objects/workout-status";

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

const identifier = <T extends string>() =>
  text("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())
    .$type<T>();

const timestamp = (name: string) => integer(name, { mode: "number" }).$type<tools.TimestampValueType>();

const toEnumList = (value: Record<string, string>) => {
  const [first, ...rest] = Object.keys(value);

  if (first === undefined) throw new Error("Enum list cannot be empty");

  return { enum: [first, ...rest] satisfies [string, ...ReadonlyArray<string>] };
};

export const events = sqliteTable(
  "events",
  {
    id: identifier<bg.UUIDType>(),
    correlationId: text("correlationId").notNull().$type<bg.CorrelationIdType>(),
    createdAt: integer("createdAt").default(sql`now`).notNull(),
    name: text("name").notNull(),
    stream: text("stream").notNull().$type<bg.EventStreamType>(),
    version: integer("version").notNull(),
    revision: integer("revision").notNull().default(0).$type<tools.RevisionValueType>(),
    commit: text("commit").notNull().$type<bg.CommitShaValueType>(),
    payload: text("payload").notNull(),
  },
  (table) => [
    index("stream_idx").on(table.stream),
    // cspell:disable-next-line
    uniqueIndex("stream_revision_uidx").on(table.stream, table.revision),
  ],
);

export const userPreferences = sqliteTable(
  "user_preferences",
  {
    id,
    userId: text("userId", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .$type<UserIdType>(),
    // NOTE: length 2 is a legacy artifact of passing SupportedLanguages here; kept to avoid DDL drift
    preference: text("preference", { length: 2, enum: ["language", "weekly_summary"] }).notNull(),
    value: text("value").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [
    uniqueIndex("user_preferences_userId_preference_uidx").on(table.userId, table.preference),
    index("user_preferences_userId_idx").on(table.userId),
    index("user_preferences_preference_idx").on(table.preference),
  ],
);

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, { fields: [userPreferences.userId], references: [users.id] }),
}));

export const userProfileAvatars = sqliteTable(
  "user_profile_avatars",
  {
    id,
    userId: text("userId", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .$type<UserIdType>(),
    key: text("key").notNull().$type<tools.ObjectKeyType>(),
    etag: text("etag").notNull().$type<bg.HashValueType>(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => [
    index("user_profile_avatars_userId_idx").on(table.userId),
    uniqueIndex("user_profile_avatars_userId_uniq").on(table.userId),
  ],
);

export const userProfileAvatarsRelations = relations(userProfileAvatars, ({ one }) => ({
  user: one(users, { fields: [userProfileAvatars.userId], references: [users.id] }),
}));

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$type<UserIdType>(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => !1)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    // biome-ignore lint: lint/style/noRestrictedGlobals
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    // biome-ignore lint: lint/style/noRestrictedGlobals
    .$defaultFn(() => new Date())
    .notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  // biome-ignore lint: lint/style/noRestrictedGlobals
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const exercises = sqliteTable("exercises", {
  id: identifier<ExerciseIdType>(),
  name: text("name").notNull().$type<ExerciseNameType>(),
  description: text("description").notNull().$type<ExerciseDescriptionType>(),
  image: text("image").notNull().$type<tools.ObjectKeyType>(),
  imageEtag: text("imageEtag").notNull().$type<bg.HashValueType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const exerciseCategories = sqliteTable("exercise_categories", {
  id: identifier<ExerciseCategoryIdType>(),
  name: text("name").notNull().$type<ExerciseCategoryNameType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const exerciseCategoryAssignments = sqliteTable(
  "exercise_category_assignments",
  {
    exerciseId: text("exerciseId", { length: 36 }).notNull().$type<ExerciseIdType>(),
    exerciseCategoryId: text("exerciseCategoryId", { length: 36 }).notNull().$type<ExerciseCategoryIdType>(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => [primaryKey({ columns: [table.exerciseId, table.exerciseCategoryId] })],
);

export const exercisesRelations = relations(exercises, ({ many }) => ({
  categoryAssignments: many(exerciseCategoryAssignments),
}));

export const exerciseCategoryAssignmentsRelations = relations(exerciseCategoryAssignments, ({ one }) => ({
  exercise: one(exercises, { fields: [exerciseCategoryAssignments.exerciseId], references: [exercises.id] }),
  category: one(exerciseCategories, {
    fields: [exerciseCategoryAssignments.exerciseCategoryId],
    references: [exerciseCategories.id],
  }),
}));

export const plans = sqliteTable("plans", {
  id: identifier<PlanIdType>(),
  name: text("name").notNull().$type<PlanNameType>(),
  description: text("description").$type<PlanDescriptionType>(),
  status: text("kind", toEnumList(PlanStatusEnum)).notNull().$type<PlanStatusEnum>(),
  revision: integer("revision").notNull().default(0).$type<tools.RevisionValueType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const planSections = sqliteTable("planSections", {
  id: identifier<PlanSectionIdType>(),
  planId: text("planId", { length: 36 }).notNull().$type<PlanIdType>(),
  name: text("name").notNull().$type<PlanSectionNameType>(),
  warmup: text("warmup").$type<PlanSectionWarmupType>(),
  cooldown: text("cooldown").$type<PlanSectionCooldownType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const planSectionExerciseInstructions = sqliteTable("planSectionExerciseInstructions", {
  id: identifier<ExerciseInstructionIdType>(),
  planId: text("planId", { length: 36 }).notNull().$type<PlanIdType>(),
  planSectionId: text("planSectionId", { length: 36 }).notNull().$type<PlanSectionIdType>(),
  exerciseId: text("exerciseId", { length: 36 }).notNull().$type<ExerciseIdType>(),
  sets: integer("sets", { mode: "number" }).notNull().$type<SetsType>(),
  reps: text("reps", { mode: "json" }).notNull().$type<PlanRepsType>(),
  progression: text("progression", toEnumList(ProgressionMethodOptions))
    .notNull()
    .default(ProgressionMethodOptions.double_progression)
    .$type<ProgressionMethodType>(),
  position: integer("position", { mode: "number" })
    .notNull()
    .default(0)
    .$type<ExerciseInstructionPositionType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const plansRelations = relations(plans, ({ many }) => ({
  sections: many(planSections),
}));

export const planSectionsRelations = relations(planSections, ({ one, many }) => ({
  plan: one(plans, { fields: [planSections.planId], references: [plans.id] }),
  exerciseInstructions: many(planSectionExerciseInstructions),
}));

export const planSectionExerciseInstructionsRelations = relations(
  planSectionExerciseInstructions,
  ({ one }) => ({
    planSection: one(planSections, {
      fields: [planSectionExerciseInstructions.planSectionId],
      references: [planSections.id],
    }),
    exercise: one(exercises, {
      fields: [planSectionExerciseInstructions.exerciseId],
      references: [exercises.id],
    }),
  }),
);

export const workouts = sqliteTable(
  "workouts",
  {
    id: identifier<WorkoutIdType>(),
    planId: text("planId", { length: 36 }).notNull().$type<PlanIdType>(),
    planName: text("planName").notNull().$type<PlanNameType>(),
    planSectionId: text("planSectionId", { length: 36 }).notNull().$type<PlanSectionIdType>(),
    planSectionName: text("planSectionName").notNull().$type<PlanSectionNameType>(),
    planSectionWarmup: text("planSectionWarmup").$type<PlanSectionWarmupType>(),
    planSectionCooldown: text("planSectionCooldown").$type<PlanSectionCooldownType>(),
    scheduledFor: text("scheduledFor").notNull().$type<WorkoutScheduledForType>(),
    status: text("status", toEnumList(WorkoutStatusEnum)).notNull().$type<WorkoutStatusEnum>(),
    completedAt: timestamp("completedAt"),
    note: text("note").$type<WorkoutNoteType>(),
    revision: integer("revision").notNull().default(0).$type<tools.RevisionValueType>(),
    userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [
    index("workouts_userId_status_scheduledFor_idx").on(table.userId, table.status, table.scheduledFor),
  ],
);

export const workoutExercises = sqliteTable(
  "workoutExercises",
  {
    id: identifier<WorkoutExerciseIdType>(),
    workoutId: text("workoutId", { length: 36 }).notNull().$type<WorkoutIdType>(),
    exerciseId: text("exerciseId", { length: 36 }).notNull().$type<ExerciseIdType>(),
    exerciseName: text("exerciseName").notNull().$type<ExerciseNameType>(),
    exerciseImageEtag: text("exerciseImageEtag").notNull().$type<bg.HashValueType>(),
    exerciseDescription: text("exerciseDescription").notNull().$type<ExerciseDescriptionType>(),
    prescription: text("prescription", { mode: "json" }).notNull().$type<ExercisePrescriptionType>(),
    target: text("target", { mode: "json" }).$type<ExerciseTargetType>(),
    position: integer("position", { mode: "number" })
      .notNull()
      .default(0)
      .$type<WorkoutExercisePositionType>(),
    userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [index("workoutExercises_userId_exerciseId_idx").on(table.userId, table.exerciseId)],
);

export const workoutLoggedSets = sqliteTable(
  "workoutLoggedSets",
  {
    id: identifier<LoggedSetIdType>(),
    workoutExerciseId: text("workoutExerciseId", { length: 36 }).notNull().$type<WorkoutExerciseIdType>(),
    setNumber: integer("setNumber", { mode: "number" }).notNull().$type<SetNumberType>(),
    workoutId: text("workoutId", { length: 36 }).notNull().$type<WorkoutIdType>(),
    reps: integer("reps", { mode: "number" }).notNull().$type<WorkoutRepsType>(),
    load: integer("load", { mode: "number" }).notNull().$type<LoadType>(),
    rir: integer("rir", { mode: "number" }).$type<RirType>(),
    userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => [
    index("workoutLoggedSets_workoutExerciseId_idx").on(table.workoutExerciseId),
    index("workoutLoggedSets_userId_idx").on(table.userId),
  ],
);

export const workoutsRelations = relations(workouts, ({ many }) => ({
  exercises: many(workoutExercises),
  loggedSets: many(workoutLoggedSets),
}));

export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, { fields: [workoutExercises.workoutId], references: [workouts.id] }),
  loggedSets: many(workoutLoggedSets),
}));

export const workoutLoggedSetsRelations = relations(workoutLoggedSets, ({ one }) => ({
  workout: one(workouts, { fields: [workoutLoggedSets.workoutId], references: [workouts.id] }),
  workoutExercise: one(workoutExercises, {
    fields: [workoutLoggedSets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));

export const bodyWeightMeasurements = sqliteTable(
  "bodyWeightMeasurements",
  {
    id: identifier<BodyWeightMeasurementIdType>(),
    weight: integer("weight", { mode: "number" }).notNull().$type<BodyWeightType>(),
    measuredOn: text("measuredOn").notNull().$type<BodyWeightMeasuredOnType>(),
    reference: integer("reference", { mode: "boolean" }).notNull().default(false),
    goal: text("goal").notNull().$type<BodyWeightGoalType>().default(BodyWeightGoalOptions.maintain),
    userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [index("bodyWeightMeasurements_userId_idx").on(table.userId)],
);

export const weeklySummaries = sqliteTable(
  "weeklySummaries",
  {
    id,
    userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
    weekIsoId: text("weekIsoId").notNull().$type<tools.WeekIsoIdType>(),
    status: text("status", toEnumList(WeeklySummaryStatusEnum)).notNull().$type<WeeklySummaryStatusEnum>(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => [uniqueIndex("weeklySummaries_userId_weekIsoId_uidx").on(table.userId, table.weekIsoId)],
);
