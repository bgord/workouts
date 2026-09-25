import * as bg from "@bgord/ui";
import type { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";
import type { BodyWeightChartPoint } from "../../modules/measurements/value-objects/body-weight-chart-point";
import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import type { BodyWeightMonthSummary } from "../../modules/measurements/value-objects/body-weight-month-summary";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";

type BodyWeightListResponse = {
  month: BodyWeightHistoryMonthType | null;
  measurements: ReadonlyArray<BodyWeightMeasurement>;
  previous: BodyWeightMeasurement | null;
  months: ReadonlyArray<BodyWeightMonthSummary>;
  stats: BodyWeightStats | null;
};

type BodyWeightChartResponse = { points: ReadonlyArray<BodyWeightChartPoint> };

export class Measurements {
  static async listBodyWeight(
    request: Request | null,
    params: { month?: BodyWeightHistoryMonthType },
  ): Promise<BodyWeightListResponse> {
    return bg.ApiClient.json<BodyWeightListResponse>(
      "/api/measurements/body-weight/list",
      request,
      { month: null, measurements: [], previous: null, months: [], stats: null },
      { method: "QUERY", body: JSON.stringify(params) },
    );
  }

  static async bodyWeightChart(
    request: Request | null,
    params: { granularity: BodyWeightChartGranularityOptions },
  ): Promise<BodyWeightChartResponse> {
    return bg.ApiClient.json<BodyWeightChartResponse>(
      "/api/measurements/body-weight/chart",
      request,
      { points: [] },
      { method: "QUERY", body: JSON.stringify(params) },
    );
  }
}
