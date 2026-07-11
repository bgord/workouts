/* cSpell:disable */
import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { SupportedLanguages } from "../modules/supported-languages";

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID());

export const events = sqliteTable(
  "events",
  {
    id,
    correlationId: text("correlationId").notNull(),
    createdAt: integer("createdAt").default(sql`now`).notNull(),
    name: text("name").notNull(),
    stream: text("stream").notNull(),
    version: integer("version").notNull(),
    revision: integer("revision").notNull().default(0),
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
      .references(() => users.id, { onDelete: "cascade" }),
    preference: text("preference", SupportedLanguages).notNull(),
    value: text("value").notNull(),
    updatedAt: integer("updatedAt", { mode: "number" }).notNull(),
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
      .references(() => users.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    etag: text("etag").notNull(),
    createdAt: integer("createdAt", { mode: "number" }).notNull(),
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
  id: text("id").primaryKey(),
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

export const accounts = sqliteTable("accounts", {
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
});

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
  id,
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  createdAt: integer("capturedAt", { mode: "number" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "number" }).notNull(),
});

export const exerciseCategories = sqliteTable("exercise_categories", {
  id,
  name: text("name").notNull(),
  createdAt: integer("capturedAt", { mode: "number" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "number" }).notNull(),
});
