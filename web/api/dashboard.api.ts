import * as tools from "@bgord/tools";
import * as bg from "@bgord/ui";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";
import type { WorkoutDashboardResponse } from "../../modules/workouts/queries/get-workout-dashboard";

type DashboardResponse = { workouts: WorkoutDashboardResponse; bodyWeightStats: BodyWeightStats | null };

export class Dashboard {
  static async get(request: Request | null): Promise<DashboardResponse> {
    const zero = tools.Int.nonNegative(0);
    const completed = { month: zero, year: zero, total: zero };

    return bg.ApiClient.json<DashboardResponse>("/api/dashboard", request, {
      workouts: { inProgress: null, nextUp: null, lastCompleted: null, completed },
      bodyWeightStats: null,
    });
  }
}
