import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_MEASUREMENT_RECORDED_EVENT = "BODY_PART_MEASUREMENT_RECORDED_EVENT";
export const BodyPartMeasurementRecordedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENT_RECORDED_EVENT),
  payload: v.object({
    id: VO.BodyPartMeasurementId,
    bodyPartId: VO.BodyPartId,
    valueMm: VO.BodyPartMeasurementValue,
    measuredOn: VO.BodyPartMeasuredOn,
    userId: Auth.VO.UserId,
  }),
});
export type BodyPartMeasurementRecordedEventType = v.InferOutput<typeof BodyPartMeasurementRecordedEvent>;
