import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_FNALIZED_EVENT = "PLAN_FNALIZED_EVENT";

export const PlanFinalizedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_FNALIZED_EVENT),
  payload: v.object({ planId: VO.PlanId, ownerId: Auth.VO.UserId }),
});

export type PlanFinalizedEventType = v.InferOutput<typeof PlanFinalizedEvent>;
