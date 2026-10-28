import * as bg from "@bgord/ui";
import type { BodyWeightChartResponse } from "../../app/http/measurements/body-weight-chart-get";
import type { BodyWeightListResponse } from "../../app/http/measurements/body-weight-measurement-list";
import type { DailyStepsChartResponse } from "../../app/http/measurements/daily-steps-chart-get";
import type { DailyStepsListResponse } from "../../app/http/measurements/daily-steps-list";
import type { BodyPartListResponse } from "../../modules/measurements/queries/list-body-parts";
import type { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";
import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import type { DailyStepsChartGranularityOptions } from "../../modules/measurements/value-objects/daily-steps-chart-granularity-options";
import type { DailyStepsHistoryMonthType } from "../../modules/measurements/value-objects/daily-steps-history-month";

const unavailable = { available: false, enabled: false, hints: [] };

export class Measurements {
  static async listBodyParts(request: Request | null): Promise<BodyPartListResponse> {
    return bg.ApiClient.json<BodyPartListResponse>(
      "/api/measurements/body-part/list",
      request,
      { data: [], actions: { export: unavailable, import: unavailable } },
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
      {
        month: null,
        measurements: [],
        previous: null,
        months: [],
        stats: null,
        actions: { export: unavailable },
      },
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

  static async listDailySteps(
    request: Request | null,
    params: { month?: DailyStepsHistoryMonthType },
  ): Promise<DailyStepsListResponse> {
    return bg.ApiClient.json<DailyStepsListResponse>(
      "/api/measurements/daily-steps/list",
      request,
      {
        month: null,
        entries: [],
        previous: null,
        months: [],
        stats: null,
        goal: null,
        actions: { export: unavailable },
      },
      { method: "QUERY", body: JSON.stringify(params) },
    );
  }

  static async dailyStepsChart(
    request: Request | null,
    params: { granularity: DailyStepsChartGranularityOptions },
  ): Promise<DailyStepsChartResponse> {
    return bg.ApiClient.json<DailyStepsChartResponse>(
      "/api/measurements/daily-steps/chart",
      request,
      { points: [] },
      { method: "QUERY", body: JSON.stringify(params) },
    );
  }
}
