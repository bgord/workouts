import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_DELETED_EVENT = "BODY_PART_DELETED_EVENT";

export const BodyPartDeletedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_DELETED_EVENT),
  payload: v.object({
    id: VO.BodyPartId,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartDeletedEventType = v.InferOutput<typeof BodyPartDeletedEvent>;
