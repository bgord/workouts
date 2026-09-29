import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_MEASUREMENT_REMOVED_EVENT = "BODY_PART_MEASUREMENT_REMOVED_EVENT";

export const BodyPartMeasurementRemovedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENT_REMOVED_EVENT),
  payload: v.object({
    id: VO.BodyPartMeasurementId,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartMeasurementRemovedEventType = v.InferOutput<typeof BodyPartMeasurementRemovedEvent>;
