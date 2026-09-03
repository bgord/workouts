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
import type { ExerciseInstructionIdType } from "../modules/plans/value-objects/exercise-instruction-id";
import type { PlanIdType } from "../modules/plans/value-objects/plan-id";
import type { PlanNameType } from "../modules/plans/value-objects/plan-name";
import type { PlanSectionIdType } from "../modules/plans/value-objects/plan-section-id";
import type { PlanSectionNameType } from "../modules/plans/value-objects/plan-section-name";
import { PlanStatusEnum } from "../modules/plans/value-objects/plan-status";
import type { SetsType } from "../modules/plans/value-objects/sets";
import type { LoadType } from "../modules/workouts/value-objects/load";
import type { RepsType as WorkoutRepsType } from "../modules/workouts/value-objects/reps";
import type { SetNumberType } from "../modules/workouts/value-objects/set-number";
import type { WorkoutExerciseIdType } from "../modules/workouts/value-objects/workout-exercise-id";
import type { WorkoutIdType } from "../modules/workouts/value-objects/workout-id";
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
    preference: text("preference", { length: 2, enum: ["language"] }).notNull(),
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
    issuer: text("issuer").notNull(),
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
  (table) => [
    uniqueIndex("accounts_issuer_accountId_uidx").on(table.issuer, table.accountId),
    index("accounts_userId_idx").on(table.userId),
  ],
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

export const plans = sqliteTable("plans", {
  id: identifier<PlanIdType>(),
  name: text("name").notNull().$type<PlanNameType>(),
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
  repsMin: integer("repsMin", { mode: "number" }).notNull().$type<tools.IntegerPositiveType>(),
  repsMax: integer("repsMax", { mode: "number" }).notNull().$type<tools.IntegerPositiveType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const workouts = sqliteTable("workouts", {
  id: identifier<WorkoutIdType>(),
  planId: text("planId", { length: 36 }).notNull().$type<PlanIdType>(),
  scheduledFor: text("scheduledFor").notNull().$type<WorkoutScheduledForType>(),
  status: text("status", toEnumList(WorkoutStatusEnum)).notNull().$type<WorkoutStatusEnum>(),
  revision: integer("revision").notNull().default(0).$type<tools.RevisionValueType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const workoutExercises = sqliteTable("workoutExercises", {
  id: identifier<WorkoutExerciseIdType>(),
  workoutId: text("workoutId", { length: 36 }).notNull().$type<WorkoutIdType>(),
  exerciseId: text("exerciseId", { length: 36 }).notNull().$type<ExerciseIdType>(),
  exerciseName: text("exerciseName").notNull().$type<ExerciseNameType>(),
  prescriptionSets: integer("prescriptionSets", { mode: "number" }).notNull().$type<SetsType>(),
  prescriptionRepsMin: integer("prescriptionRepsMin", { mode: "number" })
    .notNull()
    .$type<tools.IntegerPositiveType>(),
  prescriptionRepsMax: integer("prescriptionRepsMax", { mode: "number" })
    .notNull()
    .$type<tools.IntegerPositiveType>(),
  targetSets: integer("targetSets", { mode: "number" }).$type<SetsType>(),
  targetReps: integer("targetReps", { mode: "number" }).$type<WorkoutRepsType>(),
  targetLoad: integer("targetLoad", { mode: "number" }).$type<LoadType>(),
  userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const workoutLoggedSets = sqliteTable(
  "workoutLoggedSets",
  {
    workoutExerciseId: text("workoutExerciseId", { length: 36 }).notNull().$type<WorkoutExerciseIdType>(),
    setNumber: integer("setNumber", { mode: "number" }).notNull().$type<SetNumberType>(),
    workoutId: text("workoutId", { length: 36 }).notNull().$type<WorkoutIdType>(),
    reps: integer("reps", { mode: "number" }).notNull().$type<WorkoutRepsType>(),
    load: integer("load", { mode: "number" }).notNull().$type<LoadType>(),
    userId: text("userId", { length: 36 }).notNull().$type<UserIdType>(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => [primaryKey({ columns: [table.workoutExerciseId, table.setNumber] })],
);
