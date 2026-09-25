import * as bg from "@bgord/ui";
import type { WorkoutGetResponse } from "../../modules/workouts/queries/get-workout";
import type { WorkoutListResponse } from "../../modules/workouts/queries/list-workouts";
import type { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";

export class Workouts {
  static async list(
    request: Request | null,
    params: { filter?: WorkoutListFilterOptions },
  ): Promise<WorkoutListResponse> {
    return bg.ApiClient.json<WorkoutListResponse>(
      "/api/workouts/list",
      request,
      {
        data: [],
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
