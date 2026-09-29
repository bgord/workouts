// cspell:disable
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import { anotherUserId, userId } from "./auth";
import { actionAvailable, commit, correlationId, expectAnyId, T0 } from "./shared";

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

export const bodyPartId = v.parse(Measurements.VO.BodyPartId, "1f0a3d7c-2b6e-4a9d-8c5f-3e7b1a0d9c42");
export const anotherBodyPartId = v.parse(Measurements.VO.BodyPartId, "5b8e2f14-7c3a-4d9e-b1f6-0a4c8e2d7b39");
export const bodyPartStream = v.parse(bg.EventStream, `body_part_${bodyPartId}`);

export const bodyPartName = v.parse(Measurements.VO.BodyPartName, "Left Bicep");
export const anotherBodyPartName = v.parse(Measurements.VO.BodyPartName, "Right Bicep");

export const bodyPart: Measurements.VO.BodyPart = {
  id: bodyPartId,
  name: bodyPartName,
  userId,
};

export const anotherBodyPart: Measurements.VO.BodyPart = {
  id: anotherBodyPartId,
  name: anotherBodyPartName,
  userId,
};

export const anotherUserBodyPart: Measurements.VO.BodyPart = {
  id: bodyPartId,
  name: bodyPartName,
  userId: anotherUserId,
};

export const GenericBodyPartDefinedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartStream,
  version: 1,
  commit,
  name: "BODY_PART_DEFINED_EVENT",
  payload: { id: bodyPartId, name: bodyPartName, userId },
} satisfies Measurements.Events.BodyPartDefinedEventType;

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

export const GenericBodyPartDeletedEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: bodyPartStream,
  version: 1,
  commit,
  name: "BODY_PART_DELETED_EVENT",
  payload: { id: bodyPartId, requesterId: userId },
} satisfies Measurements.Events.BodyPartDeletedEventType;

export const bodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-01");
export const anotherBodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2024-12-31");
export const futureBodyPartMeasuredOn = v.parse(Measurements.VO.BodyPartMeasuredOn, "2025-01-02");

export const bodyPartCircumference = v.parse(
  Measurements.VO.BodyPartCircumference,
  tools.Height.fromCentimeters(40).get(),
);
export const anotherBodyPartCircumference = v.parse(
  Measurements.VO.BodyPartCircumference,
  tools.Height.fromCentimeters(41).get(),
);

export const bodyPartMeasurementId = v.parse(
  Measurements.VO.BodyPartMeasurementId,
  "7c4e1a9b-3d5f-4e8a-9b2c-6f0d3a7e1b54",
);
export const bodyPartMeasurementStream = v.parse(
  bg.EventStream,
  `body_part_measurement_${bodyPartMeasurementId}`,
);
export const anotherBodyPartMeasurementId = v.parse(
  Measurements.VO.BodyPartMeasurementId,
  "2d9f6b3e-8a1c-4f7d-a5e2-9c0b4d6f1a83",
);
export const anotherBodyPartMeasurementStream = v.parse(
  bg.EventStream,
  `body_part_measurement_${anotherBodyPartMeasurementId}`,
);

export const bodyPartMeasurementEntries = [{ bodyPartId, value: bodyPartCircumference }];
export const multipleBodyPartMeasurementEntries = [
  { bodyPartId, value: bodyPartCircumference },
  { bodyPartId: anotherBodyPartId, value: anotherBodyPartCircumference },
];
export const duplicateBodyPartMeasurementEntries = [
  { bodyPartId, value: bodyPartCircumference },
  { bodyPartId, value: anotherBodyPartCircumference },
];

export const bodyPartMeasurement: Measurements.VO.BodyPartMeasurement = {
  id: bodyPartMeasurementId,
  bodyPartId,
  value: bodyPartCircumference,
  measuredOn: bodyPartMeasuredOn,
  userId,
};

export const bodyPartMeasurementExportRow: Measurements.Queries.BodyPartMeasurementExportRow = {
  id: bodyPartMeasurementId,
  bodyPartName,
  value: bodyPartCircumference,
  measuredOn: bodyPartMeasuredOn,
};

export const bodyPartMeasurementCsv = [
  "id,bodyPartName,value,measuredOn",
  `${bodyPartMeasurementId},${bodyPartName},${bodyPartCircumference},${bodyPartMeasuredOn}`,
].join("");

export const bodyPartMeasurementCsvFile = (content: string) =>
  new File([content], "body-part.csv", { type: tools.Mimes.csv.mime.toString() });

export const bodyPartMeasurementImportTemplateCsv = [
  "id,bodyPartName,value,measuredOn",
  `,${bodyPartName},,${bodyPartMeasuredOn}`,
  `,${anotherBodyPartName},,${bodyPartMeasuredOn}`,
].join("");

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
    value: bodyPartCircumference,
    measuredOn: bodyPartMeasuredOn,
    userId,
  },
} satisfies Measurements.Events.BodyPartMeasuredEventType;

export const GenericAnotherBodyPartMeasuredEvent = {
  id: expectAnyId,
  correlationId,
  createdAt: T0.ms,
  stream: anotherBodyPartMeasurementStream,
  version: 1,
  commit,
  name: "BODY_PART_MEASURED_EVENT",
  payload: {
    id: anotherBodyPartMeasurementId,
    bodyPartId: anotherBodyPartId,
    value: anotherBodyPartCircumference,
    measuredOn: bodyPartMeasuredOn,
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
    bodyPartId,
    value: anotherBodyPartCircumference,
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

export const bodyPartMeasurementLatest: Measurements.VO.BodyPartSummaryMeasurement = {
  id: bodyPartMeasurementId,
  bodyPartId,
  value: anotherBodyPartCircumference,
  measuredOn: bodyPartMeasuredOn,
};

export const bodyPartMeasurementPrevious: Measurements.VO.BodyPartSummaryMeasurement = {
  id: anotherBodyPartMeasurementId,
  bodyPartId,
  value: bodyPartCircumference,
  measuredOn: anotherBodyPartMeasuredOn,
};

export const bodyPartListResponse: Measurements.Queries.BodyPartListResponse = {
  data: [
    {
      ...bodyPart,
      measurements: [bodyPartMeasurementLatest, bodyPartMeasurementPrevious],
    },
  ],
  actions: { measure: actionAvailable, import: actionAvailable },
};

export const bodyPartListResponseEmpty: Measurements.Queries.BodyPartListResponse = {
  data: [],
  actions: {
    measure: { available: true, enabled: false, hints: ["body.part.is.defined"] },
    import: { available: true, enabled: false, hints: ["body.part.is.defined"] },
  },
};
