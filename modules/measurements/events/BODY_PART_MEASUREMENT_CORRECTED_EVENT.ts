import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_PART_MEASUREMENT_CORRECTED_EVENT = "BODY_PART_MEASUREMENT_CORRECTED_EVENT";

export const BodyPartMeasurementCorrectedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_PART_MEASUREMENT_CORRECTED_EVENT),
  payload: v.object({
    id: VO.BodyPartMeasurementId,
    value: VO.BodyPartMeasurementValue,
    measuredOn: VO.BodyPartMeasuredOn,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyPartMeasurementCorrectedEventType = v.InferOutput<typeof BodyPartMeasurementCorrectedEvent>;
