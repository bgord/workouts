import { absoluteUrl, Cookies } from "@bgord/ui";
import type { WorkoutListResponse } from "../../modules/workouts/queries/list-workouts";
import type { Workout } from "../../modules/workouts/value-objects/workout";

export class Workouts {
  static async list(request: Request | null): Promise<WorkoutListResponse> {
    const BASE = "/api/workouts/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { data: [], actions: { create: { enabled: false, hints: [] } } };
    return response.json().catch();
  }

  static async get(request: Request | null, params: { workoutId: string }): Promise<Workout | null> {
    const BASE = `/api/workouts/${params.workoutId}`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
