import { describe, expect, spyOn, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("BodyWeightStatsCalculator", async () => {
  const di = await bootstrap();

  const calculator = new Measurements.Services.BodyWeightStatsCalculator({
    ListBodyWeightMeasurements: di.Adapters.Measurements.ListBodyWeightMeasurementsQuery,
  });

  test("happy path", async () => {
    using _ = spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue([
      mocks.bodyWeightMeasurement,
    ]);

    expect(await calculator.calculate(mocks.userId)).toEqual(mocks.bodyWeightStats);
  });

  test("happy path - reference and previous week", async () => {
    const earlier: Measurements.VO.BodyWeightMeasurement = {
      ...mocks.bodyWeightReferenceMeasurement,
      weight: v.parse(Measurements.VO.BodyWeight, tools.Weight.fromKilograms(82).get()),
      measuredOn: v.parse(Measurements.VO.BodyWeightMeasuredOn, "2024-12-24"),
    };

    using _ = spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue([
      mocks.bodyWeightMeasurement,
      earlier,
    ]);

    expect(await calculator.calculate(mocks.userId)).toEqual({
      latest: mocks.bodyWeightMeasurement,
      previous: earlier,
      reference: earlier,
      baseline: earlier,
      week: { average: mocks.bodyWeight, count: 1 },
      previousWeek: { average: earlier.weight },
    });
  });

  test("no measurements", async () => {
    using _ = spyOn(di.Adapters.Measurements.ListBodyWeightMeasurementsQuery, "execute").mockResolvedValue(
      [],
    );

    expect(await calculator.calculate(mocks.userId)).toEqual(null);
  });
});
