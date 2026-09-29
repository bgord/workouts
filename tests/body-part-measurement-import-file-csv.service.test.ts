import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("BodyPartMeasurementImportFileCsv", async () => {
  const di = await bootstrap();

  test("parses a CSV", async () => {
    const content = [
      "id,bodyPartName,value,measuredOn",
      `${mocks.bodyPartMeasurementId},${mocks.bodyPartName},${mocks.bodyPartCircumference},${mocks.bodyPartMeasuredOn}`,
    ].join("\n");
    const file = new Measurements.Services.BodyPartMeasurementImportFileCsv(content, di.Adapters.System);

    const result = await file.rows();

    expect(result).toEqual([
      {
        bodyPartName: mocks.bodyPartName,
        value: mocks.bodyPartCircumference,
        measuredOn: mocks.bodyPartMeasuredOn,
      },
    ]);
  });

  test("parses an empty CSV", async () => {
    const file = new Measurements.Services.BodyPartMeasurementImportFileCsv(
      "id,bodyPartName,value,measuredOn",
      di.Adapters.System,
    );

    const result = await file.rows();

    expect(result).toEqual([]);
  });

  test("rejects an invalid row", async () => {
    const file = new Measurements.Services.BodyPartMeasurementImportFileCsv(
      `id,bodyPartName,value,measuredOn\n,${mocks.bodyPartName},abc,${mocks.bodyPartMeasuredOn}`,
      di.Adapters.System,
    );

    await expect(() => file.rows()).toThrow("height.millimeters.type");
  });
});
