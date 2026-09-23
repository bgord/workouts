// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { languages } from "+languages";
import * as Preferences from "+preferences";
import { userId } from "./auth";
import { commit, correlationId, etag, expectAnyId, T0 } from "./shared";

export const profileAvatarObjectKey = v.parse(tools.ObjectKey, `users/${userId}/avatar.webp`);

export const preferencesStream = v.parse(bg.EventStream, `preferences_${userId}`);

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

export const GenericWeeklySummarySetOnEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: preferencesStream,
  version: 1,
  commit,
  name: "WEEKLY_SUMMARY_SET_EVENT",
  payload: { userId, weeklySummary: Preferences.VO.WeeklySummaryOptions.on },
} satisfies Preferences.Events.WeeklySummarySetEventType;

export const GenericWeeklySummarySetOffEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: preferencesStream,
  version: 1,
  commit,
  name: "WEEKLY_SUMMARY_SET_EVENT",
  payload: { userId, weeklySummary: Preferences.VO.WeeklySummaryOptions.off },
} satisfies Preferences.Events.WeeklySummarySetEventType;

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
