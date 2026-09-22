import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

export const WEEKLY_SUMMARY_SENT_EVENT = "WEEKLY_SUMMARY_SENT_EVENT";

export const WeeklySummarySentEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_SUMMARY_SENT_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, weekIsoId: tools.WeekIsoId }),
});

export type WeeklySummarySentEventType = v.InferOutput<typeof WeeklySummarySentEvent>;
