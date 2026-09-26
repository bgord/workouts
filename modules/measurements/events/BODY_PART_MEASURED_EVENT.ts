import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_MEASURED_EVENT = "BODY_PART_MEASURED_EVENT";

export const BodyPartMeasuredEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_MEASURED_EVENT),
  payload: v.object({
    id: VO.BodyPartMeasurementId,
    bodyPartId: VO.BodyPartId,
    value: VO.BodyPartMeasurementValue,
    measuredOn: VO.BodyPartMeasuredOn,
    userId: Auth.VO.UserId,
  }),
});

export type BodyPartMeasuredEventType = v.InferOutput<typeof BodyPartMeasuredEvent>;
