// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import { userId } from "./auth";
import { commit, correlationId, expectAnyId, T0 } from "./shared";

export const bodyWeightMeasurementId = v.parse(
  Measurements.VO.BodyWeightMeasurementId,
  "3c7a9e21-5b4d-4f8e-a1c6-9d2b7e0f4a58",
);
export const bodyWeightMeasurementStream = v.parse(
  bg.EventStream,
  `body_weight_measurement_${bodyWeightMeasurementId}`,
);

export const anotherBodyWeightMeasurementId = v.parse(
  Measurements.VO.BodyWeightMeasurementId,
  "9f2d6b1c-7e3a-4c5d-b8a1-0e4f7c2d9a63",
);
export const anotherBodyWeightMeasurementStream = v.parse(
  bg.EventStream,
  `body_weight_measurement_${anotherBodyWeightMeasurementId}`,
);

export const bodyWeight = v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(80).get());
export const anotherBodyWeight = v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(81).get());
export const heavierBodyWeight = v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(82).get());

export const bodyWeightMeasuredOn = v.parse(Measurements.VO.BodyWeightMeasuredOn, "2025-01-01");
export const anotherBodyWeightMeasuredOn = v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-31");
export const futureBodyWeightMeasuredOn = v.parse(Measurements.VO.BodyWeightMeasuredOn, "2025-01-02");

export const bodyWeightMeasurement: Measurements.VO.BodyWeightMeasurement = {
  id: bodyWeightMeasurementId,
  weight: bodyWeight,
  measuredOn: bodyWeightMeasuredOn,
  userId,
  reference: false,
  goal: Measurements.VO.BodyWeightGoalOptions.maintain,
};

export const heavierBodyWeightMeasurement: Measurements.VO.BodyWeightMeasurement = {
  ...bodyWeightMeasurement,
  weight: heavierBodyWeight,
  measuredOn: anotherBodyWeightMeasuredOn,
};

export const bodyWeightReferenceMeasurement: Measurements.VO.BodyWeightMeasurement = {
  ...bodyWeightMeasurement,
  reference: true,
};

export const bodyWeightStats: Measurements.VO.BodyWeightStats = {
  latest: bodyWeightMeasurement,
  previous: undefined,
  reference: undefined,
  baseline: bodyWeightMeasurement,
  week: { average: bodyWeight, count: 1 },
  previousWeek: undefined,
};

export const bodyWeightReferenceStream = v.parse(bg.EventStream, `body_weight_reference_${userId}`);

export const bodyWeightMeasurementCsv = [
  "id,weight,measuredOn",
  `${bodyWeightMeasurementId},${bodyWeight},${bodyWeightMeasuredOn}`,
].join("");

export const bodyWeightMeasurementCsvFile = (content: string) =>
  new File([content], "body-weight.csv", { type: tools.Mimes.csv.mime.toString() });

export const GenericBodyWeightMeasuredEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyWeightMeasurementStream,
  version: 1,
  commit,
  name: "BODY_WEIGHT_MEASURED_EVENT",
  payload: { id: bodyWeightMeasurementId, weight: bodyWeight, measuredOn: bodyWeightMeasuredOn, userId },
} satisfies Measurements.Events.BodyWeightMeasuredEventType;

export const GenericBodyWeightMeasuredEventAnother = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: anotherBodyWeightMeasurementStream,
  version: 1,
  commit,
  name: "BODY_WEIGHT_MEASURED_EVENT",
  payload: {
    id: anotherBodyWeightMeasurementId,
    weight: anotherBodyWeight,
    measuredOn: anotherBodyWeightMeasuredOn,
    userId,
  },
} satisfies Measurements.Events.BodyWeightMeasuredEventType;

export const GenericBodyWeightReferenceSetEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyWeightReferenceStream,
  version: 1,
  commit,
  name: "BODY_WEIGHT_REFERENCE_SET_EVENT",
  payload: {
    measurementId: bodyWeightMeasurementId,
    goal: Measurements.VO.BodyWeightGoalOptions.bulk,
    userId,
  },
} satisfies Measurements.Events.BodyWeightReferenceSetEventType;

export const GenericBodyWeightMeasurementCorrectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyWeightMeasurementStream,
  version: 1,
  commit,
  name: "BODY_WEIGHT_MEASUREMENT_CORRECTED_EVENT",
  payload: {
    id: bodyWeightMeasurementId,
    weight: anotherBodyWeight,
    measuredOn: anotherBodyWeightMeasuredOn,
    requesterId: userId,
  },
} satisfies Measurements.Events.BodyWeightMeasurementCorrectedEventType;

export const GenericBodyWeightMeasurementRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyWeightMeasurementStream,
  version: 1,
  commit,
  name: "BODY_WEIGHT_MEASUREMENT_REMOVED_EVENT",
  payload: { id: bodyWeightMeasurementId, requesterId: userId },
} satisfies Measurements.Events.BodyWeightMeasurementRemovedEventType;
