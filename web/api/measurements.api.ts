import type { ActionState } from "@bgord/bun";
import * as bg from "@bgord/ui";
import type { BodyPartListResponse } from "../../modules/measurements/queries/list-body-parts";
import type { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";
import type { BodyWeightChartPoint } from "../../modules/measurements/value-objects/body-weight-chart-point";
import type { BodyWeightHistoryMonthType } from "../../modules/measurements/value-objects/body-weight-history-month";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import type { BodyWeightMonthSummary } from "../../modules/measurements/value-objects/body-weight-month-summary";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";
import type { DailySteps } from "../../modules/measurements/value-objects/daily-steps";
import type { DailyStepsChartGranularityOptions } from "../../modules/measurements/value-objects/daily-steps-chart-granularity-options";
import type { DailyStepsChartPoint } from "../../modules/measurements/value-objects/daily-steps-chart-point";
import type { DailyStepsEntry } from "../../modules/measurements/value-objects/daily-steps-entry";
import type { DailyStepsGoalType } from "../../modules/measurements/value-objects/daily-steps-goal";
import type { DailyStepsHistoryMonthType } from "../../modules/measurements/value-objects/daily-steps-history-month";
import type { DailyStepsMonthSummary } from "../../modules/measurements/value-objects/daily-steps-month-summary";
import type { DailyStepsStats } from "../../modules/measurements/value-objects/daily-steps-stats";

type BodyWeightListResponse = {
  month: BodyWeightHistoryMonthType | null;
  measurements: ReadonlyArray<BodyWeightMeasurement>;
  previous: BodyWeightMeasurement | null;
  months: ReadonlyArray<BodyWeightMonthSummary>;
  stats: BodyWeightStats | null;
  actions: { export: ActionState };
};

type DailyStepsListResponse = {
  month: DailyStepsHistoryMonthType | null;
  entries: ReadonlyArray<DailyStepsEntry>;
  previous: DailySteps | null;
  months: ReadonlyArray<DailyStepsMonthSummary>;
  stats: DailyStepsStats | null;
  goal: DailyStepsGoalType | null;
  actions: { export: ActionState };
};

type BodyWeightChartResponse = { points: ReadonlyArray<BodyWeightChartPoint> };

type DailyStepsChartResponse = { points: ReadonlyArray<DailyStepsChartPoint> };

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
