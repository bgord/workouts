import * as bg from "@bgord/bun";
import * as v from "valibot";
import type { BodyPartMeasurementIdType } from "./body-part-measurement-id";

export const BodyPartMeasurementStream = {
  of: (id: BodyPartMeasurementIdType) => v.parse(bg.EventStream, `body_part_measurement_${id}`),
};
