import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_ADDED_EVENT = "BODY_PART_ADDED_EVENT";
export const BodyPartAddedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_ADDED_EVENT),
  payload: v.object({ id: VO.BodyPartId, name: VO.BodyPartName, userId: Auth.VO.UserId }),
});
export type BodyPartAddedEventType = v.InferOutput<typeof BodyPartAddedEvent>;
