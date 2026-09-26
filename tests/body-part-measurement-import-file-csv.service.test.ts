import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("BodyPartMeasurementImportFileCsv", async () => {
  const di = await bootstrap();

  test("parses a CSV", async () => {
    const content = [
      "bodyPart,value,measuredOn",
      `${mocks.bodyPartName},${mocks.bodyPartMeasurementValue},${mocks.bodyPartMeasuredOn}`,
    ].join("\n");
    const file = new Measurements.Services.BodyPartMeasurementImportFileCsv(content, di.Adapters.System);

    const result = await file.rows();

    expect(result).toEqual([
      {
        bodyPartName: mocks.bodyPartName,
        value: mocks.bodyPartMeasurementValue,
        measuredOn: mocks.bodyPartMeasuredOn,
      },
    ]);
  });

  test("parses an empty CSV", async () => {
    const file = new Measurements.Services.BodyPartMeasurementImportFileCsv(
      "bodyPart,value,measuredOn",
      di.Adapters.System,
    );

    const result = await file.rows();

    expect(result).toEqual([]);
  });

  test("rejects an invalid row", async () => {
    const file = new Measurements.Services.BodyPartMeasurementImportFileCsv(
      "bodyPart,value,measuredOn\nChest,abc,2025-01-01",
      di.Adapters.System,
    );

    await expect(() => file.rows()).toThrow("body.part.measurement.value.type");
  });
});
