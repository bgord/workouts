import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Auth from "+auth";
import * as VO from "+measurements/value-objects";

export const BODY_WEIGHT_MEASURED_EVENT = "BODY_WEIGHT_MEASURED_EVENT";

export const BodyWeightMeasuredEvent = v.object({
  ...bg.EventEnvelopeSchema,
  name: v.literal(BODY_WEIGHT_MEASURED_EVENT),
  payload: v.object({
    id: VO.BodyWeightMeasurementId,
    weight: VO.BodyWeight,
    measuredOn: VO.BodyWeightMeasuredOn,
    userId: Auth.VO.UserId,
  }),
});

export type BodyWeightMeasuredEventType = v.InferOutput<typeof BodyWeightMeasuredEvent>;
