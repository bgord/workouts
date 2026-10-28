import * as bg from "@bgord/bun";
import * as v from "valibot";
import type { BodyWeightMeasurementIdType } from "./body-weight-measurement-id";

export const BodyWeightMeasurementStream = {
  of: (id: BodyWeightMeasurementIdType) => v.parse(bg.EventStream, `body_weight_measurement_${id}`),
};
