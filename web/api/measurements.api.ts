import * as bg from "@bgord/ui";
import type { BodyPartListResponse } from "../../modules/measurements/queries/list-body-parts";
import type { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";
import type { BodyWeightChartPoint } from "../../modules/measurements/value-objects/body-weight-chart-point";
import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import type { BodyWeightMonthSummary } from "../../modules/measurements/value-objects/body-weight-month-summary";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";
import type { DailySteps } from "../../modules/measurements/value-objects/daily-steps";
import type { DailyStepsStats } from "../../modules/measurements/value-objects/daily-steps-stats";
import type { StepsChartGranularityOptions } from "../../modules/measurements/value-objects/steps-chart-granularity-options";
import type { StepsChartPoint } from "../../modules/measurements/value-objects/steps-chart-point";
import type { StepsHistoryMonthType } from "../../modules/measurements/value-objects/steps-history-month";
import type { StepsMonthSummary } from "../../modules/measurements/value-objects/steps-month-summary";

type BodyWeightListResponse = {
  month: BodyWeightHistoryMonthType | null;
  measurements: ReadonlyArray<BodyWeightMeasurement>;
  previous: BodyWeightMeasurement | null;
  months: ReadonlyArray<BodyWeightMonthSummary>;
  stats: BodyWeightStats | null;
};

type DailyStepsListResponse = {
  month: StepsHistoryMonthType | null;
  entries: ReadonlyArray<DailySteps>;
  months: ReadonlyArray<StepsMonthSummary>;
  stats: DailyStepsStats | null;
};

type BodyWeightChartResponse = { points: ReadonlyArray<BodyWeightChartPoint> };

type DailyStepsChartResponse = { points: ReadonlyArray<StepsChartPoint> };

const unavailable = { available: false, enabled: false, hints: [] };

export class Measurements {
  static async listBodyParts(request: Request | null): Promise<BodyPartListResponse> {
    return bg.ApiClient.json<BodyPartListResponse>(
      "/api/measurements/body-part/list",
      request,
      { data: [], actions: { import: unavailable } },
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

  static async listDailySteps(
    request: Request | null,
    params: { month?: StepsHistoryMonthType },
  ): Promise<DailyStepsListResponse> {
    return bg.ApiClient.json<DailyStepsListResponse>(
      "/api/measurements/daily-steps/list",
      request,
      { month: null, entries: [], months: [], stats: null },
      { method: "QUERY", body: JSON.stringify(params) },
    );
  }

  static async dailyStepsChart(
    request: Request | null,
    params: { granularity: StepsChartGranularityOptions },
  ): Promise<DailyStepsChartResponse> {
    return bg.ApiClient.json<DailyStepsChartResponse>(
      "/api/measurements/daily-steps/chart",
      request,
      { points: [] },
      { method: "QUERY", body: JSON.stringify(params) },
    );
  }
}
