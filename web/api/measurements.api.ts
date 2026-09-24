import type { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";
import type { BodyWeightChartPoint } from "../../modules/measurements/value-objects/body-weight-chart-point";
import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import type { BodyWeightMonthSummary } from "../../modules/measurements/value-objects/body-weight-month-summary";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";
import { ApiClient } from "./api-client";

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
    const response = await ApiClient.fetch("/api/measurements/body-weight/list", request, {
      method: "QUERY",
      body: JSON.stringify(params),
    });

    if (!response.ok) return { month: null, measurements: [], previous: null, months: [], stats: null };
    return response.json();
  }

  static async bodyWeightChart(
    request: Request | null,
    params: { granularity: BodyWeightChartGranularityOptions },
  ): Promise<BodyWeightChartResponse> {
    const response = await ApiClient.fetch("/api/measurements/body-weight/chart", request, {
      method: "QUERY",
      body: JSON.stringify(params),
    });

    if (!response.ok) return { points: [] };
    return response.json();
  }
}
