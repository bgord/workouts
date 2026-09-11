import { absoluteUrl, Cookies } from "@bgord/ui";
import type { WorkoutGetResponse } from "../../modules/workouts/queries/get-workout";
import type { WorkoutDashboardResponse } from "../../modules/workouts/queries/get-workout-dashboard";
import type { WorkoutListResponse } from "../../modules/workouts/queries/list-workouts";

export class Workouts {
  static async list(request: Request | null): Promise<WorkoutListResponse> {
    const BASE = "/api/workouts/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok)
      return { data: [], sections: [], actions: { create: { available: true, enabled: false, hints: [] } } };
    return response.json().catch();
  }

  static async dashboard(request: Request | null): Promise<WorkoutDashboardResponse> {
    const BASE = "/api/workouts/dashboard";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { inProgress: null, nextUp: null, lastCompleted: null };
    return response.json().catch();
  }

  static async get(
    request: Request | null,
    params: { workoutId: string },
  ): Promise<WorkoutGetResponse | null> {
    const BASE = `/api/workouts/${params.workoutId}`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
