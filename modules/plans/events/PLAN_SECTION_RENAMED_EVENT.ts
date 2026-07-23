import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as VO from "+plans/value-objects";

export const PLAN_SECTION_RENAMED_EVENT = "PLAN_SECTION_RENAMED_EVENT";

export const PlanSectionRenamedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(PLAN_SECTION_RENAMED_EVENT),
  payload: v.object({ planSectionId: VO.PlanSectionId, planSectionName: VO.PlanSectionName }),
});

export type PlanSectionRenamedEventType = v.InferOutput<typeof PlanSectionRenamedEvent>;
