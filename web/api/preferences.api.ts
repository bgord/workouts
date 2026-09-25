import * as bg from "@bgord/ui";
import type { WeeklySummaryType } from "../../modules/preferences/value-objects/weekly-summary";
import { WeeklySummaryDefault } from "../../modules/preferences/value-objects/weekly-summary";

type WeeklySummaryResponse = { weeklySummary: WeeklySummaryType };

export class Preferences {
  static async getWeeklySummary(request: Request | null): Promise<WeeklySummaryResponse> {
    return bg.ApiClient.json<WeeklySummaryResponse>("/api/preferences/weekly-summary/get", request, {
      weeklySummary: WeeklySummaryDefault,
    });
  }
}
