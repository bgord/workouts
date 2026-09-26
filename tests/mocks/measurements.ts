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

export const bodyWeightMonthSummary: Measurements.VO.BodyWeightMonthSummary = {
  month: v.parse(tools.MonthIsoId, "2025-01"),
  count: 1,
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

export const bodyPartId = v.parse(Measurements.VO.BodyPartId, "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d");
export const bodyPartStream = v.parse(bg.EventStream, `body_part_${bodyPartId}`);

export const anotherBodyPartId = v.parse(Measurements.VO.BodyPartId, "2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e");
export const anotherBodyPartStream = v.parse(bg.EventStream, `body_part_${anotherBodyPartId}`);

export const bodyPartName = v.parse(Measurements.VO.BodyPartName, "Chest");
export const anotherBodyPartName = v.parse(Measurements.VO.BodyPartName, "Waist");

export const bodyPart: Measurements.VO.BodyPart = { id: bodyPartId, name: bodyPartName, userId };
export const anotherBodyPart: Measurements.VO.BodyPart = {
  id: anotherBodyPartId,
  name: anotherBodyPartName,
  userId,
};

export const bodyPartMeasurementId = v.parse(
  Measurements.VO.BodyPartMeasurementId,
  "3c4d5e6f-7a8b-4c9d-8e1f-2a3b4c5d6e7f",
);
export const bodyPartMeasurementStream = v.parse(
  bg.EventStream,
  `body_part_measurement_${bodyPartMeasurementId}`,
);

export const anotherBodyPartMeasurementId = v.parse(
  Measurements.VO.BodyPartMeasurementId,
  "4d5e6f7a-8b9c-4d0e-9f2a-3b4c5d6e7f8a",
);
export const anotherBodyPartMeasurementStream = v.parse(
  bg.EventStream,
  `body_part_measurement_${anotherBodyPartMeasurementId}`,
);

export const bodyPartMeasurementValue = v.parse(Measurements.VO.BodyPartMeasurementValue, 1020);
export const anotherBodyPartMeasurementValue = v.parse(Measurements.VO.BodyPartMeasurementValue, 1050);
export const heavierBodyPartMeasurementValue = v.parse(Measurements.VO.BodyPartMeasurementValue, 1080);

export const bodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-01");
export const anotherBodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2024-12-31");
export const futureBodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-02");

export const bodyPartMeasurement: Measurements.VO.BodyPartMeasurement = {
  id: bodyPartMeasurementId,
  bodyPartId,
  value: bodyPartMeasurementValue,
  measuredOn: bodyPartMeasuredOn,
  userId,
};

export const heavierBodyPartMeasurement: Measurements.VO.BodyPartMeasurement = {
  ...bodyPartMeasurement,
  value: heavierBodyPartMeasurementValue,
  measuredOn: anotherBodyPartMeasuredOn,
};

export const bodyPartStats: Measurements.VO.BodyPartStats = {
  latest: bodyPartMeasurement,
  previous: undefined,
  baseline: bodyPartMeasurement,
  week: { average: bodyPartMeasurementValue, count: 1 },
  previousWeek: undefined,
};

export const bodyPartMonthSummary: Measurements.VO.BodyPartMonthSummary = {
  month: v.parse(tools.MonthIsoId, "2025-01"),
  count: 1,
};

export const bodyPartMeasurementCsv = [
  "id,bodyPartId,bodyPartName,value,measuredOn",
  `${bodyPartMeasurementId},${bodyPartId},${bodyPartName},${bodyPartMeasurementValue},${bodyPartMeasuredOn}`,
].join("");

export const bodyPartMeasurementCsvFile = (content: string) =>
  new File([content], "body-part.csv", { type: tools.Mimes.csv.mime.toString() });

export const GenericBodyPartAddedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartStream,
  version: 1,
  commit,
  name: "BODY_PART_ADDED_EVENT",
  payload: { id: bodyPartId, name: bodyPartName, userId },
} satisfies Measurements.Events.BodyPartAddedEventType;

export const GenericBodyPartRenamedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartStream,
  version: 1,
  commit,
  name: "BODY_PART_RENAMED_EVENT",
  payload: { id: bodyPartId, name: anotherBodyPartName, requesterId: userId },
} satisfies Measurements.Events.BodyPartRenamedEventType;

export const GenericBodyPartRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartStream,
  version: 1,
  commit,
  name: "BODY_PART_REMOVED_EVENT",
  payload: { id: bodyPartId, requesterId: userId },
} satisfies Measurements.Events.BodyPartRemovedEventType;

export const GenericBodyPartMeasuredEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartMeasurementStream,
  version: 1,
  commit,
  name: "BODY_PART_MEASURED_EVENT",
  payload: {
    id: bodyPartMeasurementId,
    bodyPartId,
    value: bodyPartMeasurementValue,
    measuredOn: bodyPartMeasuredOn,
    userId,
  },
} satisfies Measurements.Events.BodyPartMeasuredEventType;

export const GenericBodyPartMeasuredEventAnother = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: anotherBodyPartMeasurementStream,
  version: 1,
  commit,
  name: "BODY_PART_MEASURED_EVENT",
  payload: {
    id: anotherBodyPartMeasurementId,
    bodyPartId,
    value: anotherBodyPartMeasurementValue,
    measuredOn: anotherBodyPartMeasuredOn,
    userId,
  },
} satisfies Measurements.Events.BodyPartMeasuredEventType;

export const GenericBodyPartMeasurementCorrectedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartMeasurementStream,
  version: 1,
  commit,
  name: "BODY_PART_MEASUREMENT_CORRECTED_EVENT",
  payload: {
    id: bodyPartMeasurementId,
    value: anotherBodyPartMeasurementValue,
    measuredOn: anotherBodyPartMeasuredOn,
    requesterId: userId,
  },
} satisfies Measurements.Events.BodyPartMeasurementCorrectedEventType;

export const GenericBodyPartMeasurementRemovedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartMeasurementStream,
  version: 1,
  commit,
  name: "BODY_PART_MEASUREMENT_REMOVED_EVENT",
  payload: { id: bodyPartMeasurementId, requesterId: userId },
} satisfies Measurements.Events.BodyPartMeasurementRemovedEventType;
