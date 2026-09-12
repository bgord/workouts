import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("BodyWeightMeasurementImportFileCsv", async () => {
  const di = await bootstrap();

  test("parses a CSV", async () => {
    const content = [
      "id,weight,measuredOn",
      `${mocks.bodyWeightMeasurementId},${mocks.bodyWeight},${mocks.bodyWeightMeasuredOn}`,
    ].join("\n");
    const file = new Measurements.Services.BodyWeightMeasurementImportFileCsv(content, di.Adapters.System);

    const result = await file.rows();

    expect(result).toEqual([{ weight: mocks.bodyWeight, measuredOn: mocks.bodyWeightMeasuredOn }]);
  });

  test("parses an empty CSV", async () => {
    const file = new Measurements.Services.BodyWeightMeasurementImportFileCsv(
      "id,weight,measuredOn",
      di.Adapters.System,
    );

    const result = await file.rows();

    expect(result).toEqual([]);
  });

  test("rejects an invalid row", async () => {
    const file = new Measurements.Services.BodyWeightMeasurementImportFileCsv(
      "id,weight,measuredOn\n,abc,2025-01-01",
      di.Adapters.System,
    );

    await expect(() => file.rows()).toThrow("weight.grams.type");
  });
});
