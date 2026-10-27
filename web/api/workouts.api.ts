import type * as tools from "@bgord/tools";
import * as bg from "@bgord/ui";
import type { WorkoutListResponse } from "../../app/http/workouts/workout-list";
import type { WorkoutGetResponse } from "../../modules/workouts/queries/get-workout";
import type { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";

export class Workouts {
  static async list(
    request: Request | null,
    params: { filter?: WorkoutListFilterOptions; section?: string },
  ): Promise<WorkoutListResponse> {
    return bg.ApiClient.json<WorkoutListResponse>(
      "/api/workouts/list",
      request,
      {
        data: { entries: [], next: null },
        count: { matching: 0 as tools.IntegerNonNegativeType, total: 0 as tools.IntegerNonNegativeType },
        sections: [],
        plan: null,
        actions: { create: { available: true, enabled: false, hints: [] } },
      },
      { method: "QUERY", body: JSON.stringify(params) },
    );
  }

  static async get(
    request: Request | null,
    params: { workoutId: string },
  ): Promise<WorkoutGetResponse | null> {
    return bg.ApiClient.json<WorkoutGetResponse | null>(`/api/workouts/${params.workoutId}`, request, null);
  }
}
