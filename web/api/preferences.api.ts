import * as bg from "@bgord/ui";
import type { WeeklySummaryType } from "../../modules/preferences/value-objects/weekly-summary";
import { WeeklySummaryDefault } from "../../modules/preferences/value-objects/weekly-summary";

type WeeklySummaryResponse = { weeklySummary: WeeklySummaryType };

export class Preferences {
  static async getWeeklySummary(request: Request | null): Promise<WeeklySummaryResponse> {
    const BASE = "/api/preferences/weekly-summary/get";

    const url = bg.absoluteUrl(BASE, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { weeklySummary: WeeklySummaryDefault };
    return response.json().catch();
  }
}
