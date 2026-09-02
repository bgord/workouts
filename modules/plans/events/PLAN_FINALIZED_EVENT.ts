import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_FINALIZED_EVENT = "PLAN_FINALIZED_EVENT";

export const PlanFinalizedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_FINALIZED_EVENT),
  payload: v.object({ planId: VO.PlanId, requesterId: Auth.VO.UserId }),
});

export type PlanFinalizedEventType = v.InferOutput<typeof PlanFinalizedEvent>;
