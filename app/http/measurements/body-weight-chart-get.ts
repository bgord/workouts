import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = { ListBodyWeightMeasurementsQuery: Measurements.Queries.ListBodyWeightMeasurements };

export const BodyWeightChartGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const granularity = v.parse(Measurements.VO.BodyWeightChartGranularity, body["granularity"]);

    const measurements = await deps.ListBodyWeightMeasurementsQuery.execute(userId);
    const points = new Measurements.Services.BodyWeightChart(measurements).points(granularity);

    return Response.json({ points });
  };
