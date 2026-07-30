import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_CREATED_EVENT = "PLAN_SECTION_CREATED_EVENT";

export const PlanSectionCreatedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_SECTION_CREATED_EVENT),
  payload: v.object({
    planId: VO.PlanId,
    planSectionId: VO.PlanSectionId,
    planSectionName: VO.PlanSectionName,
    userId: Auth.VO.UserId,
  }),
});

export type PlanSectionCreatedEventType = v.InferOutput<typeof PlanSectionCreatedEvent>;
