import * as bg from "@bgord/ui";
import type { BodyPartListResponse } from "../../modules/measurements/queries/list-body-parts";
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

const unavailable = { available: false, enabled: false, hints: [] };

export class Measurements {
  static async listBodyParts(request: Request | null): Promise<BodyPartListResponse> {
    return bg.ApiClient.json<BodyPartListResponse>(
      "/api/measurements/body-part/list",
      request,
      { data: [], actions: { measure: unavailable, import: unavailable } },
      { method: "QUERY" },
    );
  }

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
