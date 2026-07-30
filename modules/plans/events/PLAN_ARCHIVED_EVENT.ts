import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+plans/value-objects";

export const PLAN_ARCHIVED_EVENT = "PLAN_ARCHIVED_EVENT";

export const PlanArchivedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_ARCHIVED_EVENT),
  payload: v.object({ planId: VO.PlanId, userId: Auth.VO.UserId }),
});

export type PlanArchivedEventType = v.InferOutput<typeof PlanArchivedEvent>;
