import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

type Dependencies = { ListBodyPartMeasurementsQuery: Measurements.Queries.ListBodyPartMeasurements };

export const BodyPartChartGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const bodyPartId = v.parse(Measurements.VO.BodyPartId, body["bodyPartId"]);
    const granularity = v.parse(Measurements.VO.BodyPartChartGranularity, body["granularity"]);

    const measurements = await deps.ListBodyPartMeasurementsQuery.execute(userId);
    const points = new Measurements.Services.BodyPartChart(
      measurements.filter((measurement) => measurement.bodyPartId === bodyPartId),
    ).points(granularity);

    return Response.json({ points });
  };
