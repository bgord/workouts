import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT = "BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT";

export const BodyWeightMeasurementCorrectedEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT),
  payload: v.object({
    id: VO.BodyWeightMeasurementId,
    weight: VO.BodyWeight,
    measuredOn: VO.BodyWeightMeasuredOn,
    requesterId: Auth.VO.UserId,
  }),
});

export type BodyWeightMeasurementCorrectedEventType = v.InferOutput<
  typeof BodyWeightMeasurementCorrectedEvent
>;
