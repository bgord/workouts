import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("BodyPartMeasurementExportFileCsv", async () => {
  const di = await bootstrap();

  test("generates a CSV", async () => {
    const file = new Measurements.Services.BodyPartMeasurementExportFileCsv(
      [mocks.bodyPartMeasurement],
      [mocks.bodyPart],
      di.Adapters.System,
    );

    const result = await file.create();

    expect(result).toEqualIgnoringWhitespace(mocks.bodyPartMeasurementCsv);
  });
});
