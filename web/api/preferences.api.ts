import type { WeeklySummaryType } from "../../modules/preferences/value-objects/weekly-summary";
import { WeeklySummaryDefault } from "../../modules/preferences/value-objects/weekly-summary";
import { ApiClient } from "./api-client";

type WeeklySummaryResponse = { weeklySummary: WeeklySummaryType };

export class Preferences {
  static async getWeeklySummary(request: Request | null): Promise<WeeklySummaryResponse> {
    return ApiClient.get<WeeklySummaryResponse>("/api/preferences/weekly-summary/get", request, {
      weeklySummary: WeeklySummaryDefault,
    });
  }
}
