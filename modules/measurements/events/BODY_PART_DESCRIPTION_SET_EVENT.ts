import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_DESCRIPTION_SET_EVENT = "BODY_PART_DESCRIPTION_SET_EVENT";

export const BodyPartDescriptionSetEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_DESCRIPTION_SET_EVENT),
  payload: v.object({
    id: VO.BodyPartId,
    description: v.optional(VO.BodyPartDescription),
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartDescriptionSetEventType = v.InferOutput<typeof BodyPartDescriptionSetEvent>;
