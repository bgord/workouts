import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_RESTORED_EVENT = "PLAN_RESTORED_EVENT";

export const PlanRestoredEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_RESTORED_EVENT),
  payload: v.object({ planId: VO.PlanId, requesterId: Auth.VO.UserId }),
});

export type PlanRestoredEventType = v.InferOutput<typeof PlanRestoredEvent>;
