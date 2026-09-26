// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import { anotherUserId, userId } from "./auth";
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

export const bodyPartId = v.parse(Measurements.VO.BodyPartId, "d7e6f5a4-b3c2-41d0-9e8f-7a6b5c4d3e2f");
export const bodyPartStream = v.parse(bg.EventStream, `body_part_${bodyPartId}`);
export const bodyPartName = v.parse(Measurements.VO.BodyPartName, "Waist");
export const anotherBodyPartName = v.parse(Measurements.VO.BodyPartName, "Chest");
export const bodyPart: Measurements.VO.BodyPart = {
  id: bodyPartId,
  userId,
  name: bodyPartName,
  archived: false,
};
export const otherUsersBodyPart: Measurements.VO.BodyPart = {
  ...bodyPart,
  userId: anotherUserId,
};
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
  ...GenericBodyPartAddedEvent,
  name: "BODY_PART_RENAMED_EVENT",
  payload: { id: bodyPartId, name: anotherBodyPartName, userId },
} satisfies Measurements.Events.BodyPartRenamedEventType;
export const GenericBodyPartArchivedEvent = {
  ...GenericBodyPartAddedEvent,
  name: "BODY_PART_ARCHIVED_EVENT",
  payload: { id: bodyPartId, userId },
} satisfies Measurements.Events.BodyPartArchivedEventType;

export const bodyPartMeasurementId = v.parse(
  Measurements.VO.BodyPartMeasurementId,
  "e8f7a6b5-c4d3-42e1-af90-8b7c6d5e4f3a",
);
export const bodyPartMeasurementStream = v.parse(
  bg.EventStream,
  `body_part_measurement_${bodyPartMeasurementId}`,
);
export const bodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-01");
export const anotherBodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2024-12-31");
export const futureBodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2999-01-01");
export const bodyPartMeasurementValue = v.parse(Measurements.VO.BodyPartMeasurementValue, 900);
export const correctedBodyPartMeasurementValue = v.parse(Measurements.VO.BodyPartMeasurementValue, 950);
export const bodyPartMeasurement: Measurements.VO.BodyPartMeasurement = {
  id: bodyPartMeasurementId,
  bodyPartId,
  userId,
  valueMm: bodyPartMeasurementValue,
  measuredOn: bodyPartMeasuredOn,
};
export const otherUsersBodyPartMeasurement: Measurements.VO.BodyPartMeasurement = {
  ...bodyPartMeasurement,
  userId: anotherUserId,
};
export const GenericBodyPartMeasurementRecordedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartMeasurementStream,
  version: 1,
  commit,
  name: "BODY_PART_MEASUREMENT_RECORDED_EVENT",
  payload: {
    id: bodyPartMeasurementId,
    bodyPartId,
    valueMm: bodyPartMeasurementValue,
    measuredOn: bodyPartMeasuredOn,
    userId,
  },
} satisfies Measurements.Events.BodyPartMeasurementRecordedEventType;
export const GenericBodyPartMeasurementCorrectedEvent = {
  ...GenericBodyPartMeasurementRecordedEvent,
  name: "BODY_PART_MEASUREMENT_CORRECTED_EVENT",
  payload: {
    id: bodyPartMeasurementId,
    valueMm: correctedBodyPartMeasurementValue,
    measuredOn: anotherBodyPartMeasuredOn,
    userId,
  },
} satisfies Measurements.Events.BodyPartMeasurementCorrectedEventType;
export const GenericBodyPartMeasurementRemovedEvent = {
  ...GenericBodyPartMeasurementRecordedEvent,
  name: "BODY_PART_MEASUREMENT_REMOVED_EVENT",
  payload: { id: bodyPartMeasurementId, userId },
} satisfies Measurements.Events.BodyPartMeasurementRemovedEventType;

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
