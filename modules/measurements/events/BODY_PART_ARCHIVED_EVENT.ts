import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_ARCHIVED_EVENT = "BODY_PART_ARCHIVED_EVENT";

export const BodyPartArchivedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_ARCHIVED_EVENT),
  payload: v.object({
    id: VO.BodyPartId,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartArchivedEventType = v.InferOutput<typeof BodyPartArchivedEvent>;
