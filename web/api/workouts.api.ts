import type { WorkoutGetResponse } from "../../modules/workouts/queries/get-workout";
import type { WorkoutListResponse } from "../../modules/workouts/queries/list-workouts";
import type { WorkoutListFilterOptions } from "../../modules/workouts/value-objects/workout-list-filter-options";
import { ApiClient } from "./api-client";

export class Workouts {
  static async list(
    request: Request | null,
    params: { filter?: WorkoutListFilterOptions },
  ): Promise<WorkoutListResponse> {
    const response = await ApiClient.fetch("/api/workouts/list", request, {
      method: "QUERY",
      body: JSON.stringify(params),
    });

    if (!response.ok)
      return {
        data: [],
        sections: [],
        plan: null,
        actions: { create: { available: true, enabled: false, hints: [] } },
      };
    return response.json();
  }

  static async get(
    request: Request | null,
    params: { workoutId: string },
  ): Promise<WorkoutGetResponse | null> {
    return ApiClient.get<WorkoutGetResponse | null>(`/api/workouts/${params.workoutId}`, request, null);
  }
}
