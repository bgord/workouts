import { absoluteUrl, Cookies } from "@bgord/ui";
import type { ExerciseSetOneRepMaxEstimate } from "../../modules/statistics/value-objects/exercise-set-one-rep-max-estimate";

export class Statistics {
  static async getExerciseSets(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<Array<ExerciseSetOneRepMaxEstimate>> {
    const BASE = `/api/statistics/exercises/${params.exerciseId}/sets`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];

    const result = await response.json().catch(() => null);

    return result ?? [];
  }

  static async getExerciseOneRepMax(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseSetOneRepMaxEstimate | null> {
    const BASE = `/api/statistics/exercises/${params.exerciseId}/one-rep-max-estimate`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;

    const result = await response.json().catch(() => null);

    return result?.oneRepMax ?? null;
  }
}
