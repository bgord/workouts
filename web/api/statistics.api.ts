import { absoluteUrl, Cookies } from "@bgord/ui";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";

export class Statistics {
  static async getExercisePerformances(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<Array<ExercisePerformance>> {
    const BASE = `/api/statistics/exercises/${params.exerciseId}/performances`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];

    const result = await response.json().catch(() => null);

    return result?.performances ?? [];
  }
}
