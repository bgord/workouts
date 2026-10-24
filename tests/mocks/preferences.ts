// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Preferences from "+preferences";
import { userId } from "./auth";
import { commit, correlationId, expectAnyId, T0 } from "./shared";

export const profileAvatarObjectKey = v.parse(tools.ObjectKey, `users/${userId}/avatar.webp`);

const preferencesStream = v.parse(bg.EventStream, `preferences_${userId}`);

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
