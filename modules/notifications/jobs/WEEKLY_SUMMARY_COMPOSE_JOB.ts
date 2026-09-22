import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Auth from "+auth";

export const WEEKLY_SUMMARY_COMPOSE_JOB = "WEEKLY_SUMMARY_COMPOSE_JOB";

export const WeeklySummaryComposeJobSchema = v.object({
  ...bg.JobEnvelopeSchema,
  name: v.literal(WEEKLY_SUMMARY_COMPOSE_JOB),
  payload: v.object({ userId: Auth.VO.UserId, weekIsoId: tools.WeekIsoId }),
});

export type WeeklySummaryComposeJobType = v.InferOutput<typeof WeeklySummaryComposeJobSchema>;
