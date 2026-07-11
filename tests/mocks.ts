// cspell:disable
import { expect } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { Session, User } from "better-auth";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Exercises from "+exercises";
import { languages } from "+languages";
import type * as Preferences from "+preferences";

// IDs
export const correlationId = "00000000-0000-0000-0000-000000000000";

export const userId = v.parse(bg.UUID, "60aac9b2-2c16-4e94-b024-0951723e0bed");
export const anotherUserId = v.parse(bg.UUID, "cd74d060-d5de-4a81-8ffb-b2dc46cd4451");
export const historyId = v.parse(bg.UUID, "8d79bd87-1709-4c15-b40c-cd0fafaa0113");
export const temporaryFileId = "55555555-1709-4c15-b40c-cd0fafaa0113";

// Timestamps
export const T0 = tools.Timestamp.fromInstant(tools.Temporal.Instant.from("2025-01-01T00:00:00Z"));

export const hourHasPassedTimestamp = T0;

export const expectAnyId = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
);

export const ip = { server: { requestIP: () => ({ address: "127.0.0.1" }) } };

export const email = v.parse(tools.Email, "user@example.com");
export const contact = { type: "email", address: email } as const;
export const anotherEmail = "another@example.com";

export const revision = new tools.Revision(0);

export const revisionHeaders = (revision: tools.RevisionValueType = 0) => ({ "if-match": `W/${revision}` });
export const correlationIdHeaders = { "correlation-id": correlationId };
export const correlationIdAndRevisionHeaders = (revision: tools.RevisionValueType = 0) => ({
  "if-match": `W/${revision}`,
  "correlation-id": correlationId,
});

export const exerciseId = v.parse(Exercises.VO.ExerciseId, "8d79bd87-1709-4c15-b40c-cd0fafaa0113");
export const exerciseName = v.parse(Exercises.VO.ExerciseName, "Bench Press Barbell Horizontal");
export const exerciseDescription = v.parse(
  Exercises.VO.ExerciseDescription,
  "Press the barbell upwards, while lying on the horizontal bench.",
);
export const exerciseImageKey = v.parse(tools.ObjectKey, `exercises/${exerciseId}/original.webp`);

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

export const etag = bg.Hash.fromString("0000000000000000000000000000000000000000000000000000000000000000");

export const head = {
  exists: true,
  etag,
  size: tools.Size.fromBytes(1234),
  lastModified: T0,
  mime: tools.Mimes.webp.mime,
};

export const profileAvatarObjectKey = v.parse(tools.ObjectKey, `users/${userId}/avatar.webp`);

export const GenericHourHasPassedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: "passage_of_time",
  version: 1,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: hourHasPassedTimestamp.ms },
} satisfies bg.System.Events.HourHasPassedEventType;

export const GenericAccountCreatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `account_${userId}`,
  version: 1,
  name: "ACCOUNT_CREATED_EVENT",
  payload: { userId, timestamp: T0.ms },
} satisfies Auth.Events.AccountCreatedEventType;

export const GenericUserLanguageSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: languages.supported.en },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericUserLanguageSetPLEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "USER_LANGUAGE_SET_EVENT",
  payload: { userId, language: languages.supported.pl },
} satisfies bg.Preferences.Events.UserLanguageSetEventType;

export const GenericProfileAvatarUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "PROFILE_AVATAR_UPDATED_EVENT",
  payload: { userId, key: profileAvatarObjectKey, etag: etag.get() },
} satisfies Preferences.Events.ProfileAvatarUpdatedEventType;

export const GenericProfileAvatarRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `preferences_${userId}`,
  version: 1,
  name: "PROFILE_AVATAR_REMOVED_EVENT",
  payload: { userId },
} satisfies Preferences.Events.ProfileAvatarRemovedEventType;

export const GenericExerciseAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `exercise_${exerciseId}`,
  version: 1,
  name: "EXERCISE_ADDED_EVENT",
  payload: { id: exerciseId, name: exerciseName, description: exerciseDescription, image: exerciseImageKey },
} satisfies Exercises.Events.ExerciseAddedEventType;

export const GenericExerciseDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `exercise_${exerciseId}`,
  version: 1,
  name: "EXERCISE_DELETED_EVENT",
  payload: { id: exerciseId, image: exerciseImageKey },
} satisfies Exercises.Events.ExerciseDeletedEventType;

export const GenericExerciseUpdatedNameEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `exercise_${exerciseId}`,
  version: 1,
  name: "EXERCISE_UPDATED_EVENT",
  payload: { id: exerciseId, name: anotherExerciseName, description: exerciseDescription },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseUpdatedDescriptionEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `exercise_${exerciseId}`,
  version: 1,
  name: "EXERCISE_UPDATED_EVENT",
  payload: { id: exerciseId, name: exerciseName, description: anotherExerciseDescription },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseUpdatedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `exercise_${exerciseId}`,
  version: 1,
  name: "EXERCISE_UPDATED_EVENT",
  payload: { id: exerciseId, name: anotherExerciseName, description: anotherExerciseDescription },
} satisfies Exercises.Events.ExerciseUpdatedEventType;

export const GenericExerciseImageChangedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: `exercise_${exerciseId}`,
  version: 1,
  name: "EXERCISE_IMAGE_CHANGED_EVENT",
  payload: { id: exerciseId, image: exerciseImageKey },
} satisfies Exercises.Events.ExerciseImageChangedEventType;

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

export const auth = { user, session, path: "/get-session", options: {} as any } as const;

export const anotherAuth = {
  user: anotherUser,
  session: anotherSession,
  path: "/get-session",
  options: {} as any,
} as const;

export const IntentionalError = "intentional.error" as const;
export const throwIntentionalError = () => {
  throw new Error(IntentionalError);
};
export const throwIntentionalErrorAsync = async () => {
  throw new Error(IntentionalError);
};

export const stream = () => new ReadableStream({ start: (controller) => controller.close() });
