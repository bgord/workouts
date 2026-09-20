import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_WARMUP_SET_EVENT = "PLAN_SECTION_WARMUP_SET_EVENT";

export const PlanSectionWarmupSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_SECTION_WARMUP_SET_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    warmup: v.optional(VO.PlanSectionWarmup),
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanSectionWarmupSetEventType = v.InferOutput<typeof PlanSectionWarmupSetEvent>;
