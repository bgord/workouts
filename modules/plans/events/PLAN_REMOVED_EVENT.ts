import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_REMOVED_EVENT = "PLAN_REMOVED_EVENT";

export const PlanRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_REMOVED_EVENT),
  payload: v.object({ planId: VO.PlanId, requesterId: Auth.VO.UserId }),
});

export type PlanRemovedEventType = v.InferOutput<typeof PlanRemovedEvent>;
