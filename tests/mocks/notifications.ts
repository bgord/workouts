// cspell:disable
import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Notifications from "+notifications";
import * as Workouts from "+workouts";
import { email, userId } from "./auth";
import { planName, planSectionName } from "./plans";
import {
  commit,
  correlationId,
  expectAnyId,
  hourHasPassedTimestamp,
  passageOfTimeStream,
  revision,
  T0,
} from "./shared";
import { workoutId, workoutScheduledFor } from "./workouts";

export const mondaySixAM = tools.Timestamp.fromInstant(Temporal.Instant.from("2025-01-06T06:00:00Z"));
export const previousWeekIsoId = tools.Week.fromTimestamp(mondaySixAM).previous().toIsoId();

export const GenericHourHasPassedMondaySixAMEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: passageOfTimeStream,
  version: 1,
  commit,
  name: "HOUR_HAS_PASSED_EVENT",
  payload: { timestamp: mondaySixAM.ms },
} satisfies bg.System.Events.HourHasPassedEventType;

export const GenericWeeklySummaryComposeJob = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  name: "WEEKLY_SUMMARY_COMPOSE_JOB",
  revision: revision.value,
  payload: { userId, weekIsoId: previousWeekIsoId },
} satisfies Notifications.Jobs.WeeklySummaryComposeJobType;

export const week = tools.Week.fromIsoId(previousWeekIsoId);

export const weeklySummaryStream = Notifications.VO.WeeklySummaryStream.of(userId, previousWeekIsoId);

export const GenericWeeklySummarySentEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: weeklySummaryStream,
  version: 1,
  commit,
  name: "WEEKLY_SUMMARY_SENT_EVENT",
  payload: { userId, weekIsoId: previousWeekIsoId },
} satisfies Notifications.Events.WeeklySummarySentEventType;

export const GenericWeeklySummarySkippedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: weeklySummaryStream,
  version: 1,
  commit,
  name: "WEEKLY_SUMMARY_SKIPPED_EVENT",
  payload: { userId, weekIsoId: previousWeekIsoId },
} satisfies Notifications.Events.WeeklySummarySkippedEventType;

export const emailContact: Auth.OHQ.EmailContact = { type: "email", address: email };

export const weekCompletedWorkout: Workouts.Queries.WeekCompletedWorkout = {
  id: workoutId,
  planName,
  planSectionName,
  scheduledFor: workoutScheduledFor,
  loggedSets: [
    {
      reps: v.parse(Workouts.VO.Reps, 5),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
    },
    {
      reps: v.parse(Workouts.VO.Reps, 10),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
    },
  ],
};

export const weeklySummaryNotificationContent: Notifications.Services.WeeklySummaryNotificationContent = {
  title: "30 Dec – 5 Jan",
  totals: [
    { value: "1", label: "workout", delta: "+1 vs last week" },
    { value: "2", label: "sets", delta: "+2 vs last week" },
    { value: "1,350", label: "volume (kg)", delta: "+1,350 vs last week" },
  ],
  bodyWeight: {
    heading: "Body weight",
    value: "80.5 kg",
    caption: "average, 4 measurements",
    note: "-0.3 vs last week",
  },
  footer: {
    before: "You get this every Monday. Turn it off in your ",
    link: "profile",
    after: ".",
    url: "http://localhost:3000/profile",
  },
  signature: "— Workouts",
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
