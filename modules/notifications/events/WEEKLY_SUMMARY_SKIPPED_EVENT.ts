import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

export const WEEKLY_SUMMARY_SKIPPED_EVENT = "WEEKLY_SUMMARY_SKIPPED_EVENT";

export const WeeklySummarySkippedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_SUMMARY_SKIPPED_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, weekIsoId: tools.WeekIsoId }),
});

export type WeeklySummarySkippedEventType = v.InferOutput<typeof WeeklySummarySkippedEvent>;
