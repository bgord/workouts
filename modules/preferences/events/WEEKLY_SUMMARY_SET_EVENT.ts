import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import { WeeklySummary } from "../value-objects/weekly-summary";

export const WEEKLY_SUMMARY_SET_EVENT = "WEEKLY_SUMMARY_SET_EVENT";

export const WeeklySummarySetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(WEEKLY_SUMMARY_SET_EVENT),
  payload: v.object({ userId: Auth.VO.UserId, weeklySummary: WeeklySummary }),
});

export type WeeklySummarySetEventType = v.InferOutput<typeof WeeklySummarySetEvent>;
