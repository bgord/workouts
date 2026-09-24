import type { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";
import type { BodyWeightChartPoint } from "../../modules/measurements/value-objects/body-weight-chart-point";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";
import { ApiClient } from "./api-client";

type BodyWeightListResponse = {
  measurements: ReadonlyArray<BodyWeightMeasurement>;
  stats: BodyWeightStats | null;
};

type BodyWeightChartResponse = { points: ReadonlyArray<BodyWeightChartPoint> };

export class Measurements {
  static async listBodyWeight(request: Request | null): Promise<BodyWeightListResponse> {
    return ApiClient.get<BodyWeightListResponse>("/api/measurements/body-weight/list", request, {
      measurements: [],
      stats: null,
    });
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
