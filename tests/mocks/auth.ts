// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { Session, User } from "better-auth";
import * as v from "valibot";
import * as Auth from "+auth";
import { commit, correlationId, expectAnyId, T0 } from "./shared";

export const userId = v.parse(bg.UUID, "592ddbc7-9d8f-4677-9f7c-14d88800eea7");
export const anotherUserId = v.parse(bg.UUID, "c9371ccb-b4dd-4f4c-a03e-3bd9fcba816a");

export const email = v.parse(tools.Email, "user@example.com");
export const anotherEmail = "another@example.com";

export const userStream = v.parse(bg.EventStream, `user_${userId}`);
export const accountStream = v.parse(bg.EventStream, `account_${userId}`);

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
  id: Auth.VO.ADMIN_USER_ID,
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
  userId: Auth.VO.ADMIN_USER_ID,
  id: "Kk3wR7pVn0aZsQdHtXmL6yBgUfCe9iJx",
};

export const auth = { user, session, path: "/get-session", options: {} } as const;

export const adminAuth = {
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
