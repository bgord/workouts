import { describe, expect, test } from "bun:test";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("DailyStepsImportFileCsv", async () => {
  const di = await bootstrap();

  test("parses a CSV", async () => {
    const content = ["day,count", `${mocks.stepsDay},${mocks.stepsCount}`].join("\n");
    const file = new Measurements.Services.DailyStepsImportFileCsv(content, di.Adapters.System);

    const result = await file.rows();

    expect(result).toEqual([{ day: mocks.stepsDay, count: mocks.stepsCount }]);
  });

  test("parses an empty CSV", async () => {
    const file = new Measurements.Services.DailyStepsImportFileCsv("day,count", di.Adapters.System);

    const result = await file.rows();

    expect(result).toEqual([]);
  });

  test("rejects an invalid row", async () => {
    const file = new Measurements.Services.DailyStepsImportFileCsv(
      "day,count\n2025-01-01,abc",
      di.Adapters.System,
    );

    await expect(() => file.rows()).toThrow("integer.non.negative.type");
  });
});
