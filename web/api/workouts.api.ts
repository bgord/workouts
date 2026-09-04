import { absoluteUrl, Cookies } from "@bgord/ui";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";

export class Workouts {
  static async list(request: Request | null): Promise<ReadonlyArray<WorkoutSummary>> {
    const BASE = "/api/workouts/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }
}
