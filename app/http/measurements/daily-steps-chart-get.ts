import type * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Measurements from "+measurements";

export type DailyStepsChartResponse = { points: ReadonlyArray<Measurements.VO.DailyStepsChartPoint> };

type Dependencies = { ListDailyStepsQuery: Measurements.Queries.ListDailySteps };

export const DailyStepsChartGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const body = await context.request.json();

    const userId = context.identity.authenticatedUserId();
    const granularity = v.parse(Measurements.VO.DailyStepsChartGranularity, body["granularity"]);

    const entries = await deps.ListDailyStepsQuery.execute(userId);
    const points = new Measurements.Services.DailyStepsChart(entries).points(granularity);

    const response: DailyStepsChartResponse = { points };

    return Response.json(response);
  };
