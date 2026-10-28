import * as bg from "@bgord/ui";
import type { DashboardResponse } from "../../app/http/dashboard/dashboard-get";

export class Dashboard {
  static async get(request: Request | null): Promise<DashboardResponse> {
    const zero = 0 as DashboardResponse["workouts"]["completed"]["total"];
    const completed = { month: zero, year: zero, total: zero };

    return bg.ApiClient.json<DashboardResponse>("/api/dashboard", request, {
      workouts: { inProgress: null, nextUp: null, lastCompleted: null, completed },
      bodyWeightStats: null,
      dailyStepsStats: null,
    });
  }
}
