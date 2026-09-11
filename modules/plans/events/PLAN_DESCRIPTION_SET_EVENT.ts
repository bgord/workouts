import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_DESCRIPTION_SET_EVENT = "PLAN_DESCRIPTION_SET_EVENT";

export const PlanDescriptionSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_DESCRIPTION_SET_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    description: v.optional(VO.PlanDescription),
    requesterId: Auth.VO.UserId,
  }),
});

export type PlanDescriptionSetEventType = v.InferOutput<typeof PlanDescriptionSetEvent>;
