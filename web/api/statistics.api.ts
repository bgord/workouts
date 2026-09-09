import { absoluteUrl, Cookies } from "@bgord/ui";

export type ExerciseBestSet = { id: string; workoutId: string; reps: number; load: number };

export class Statistics {
  static async getExerciseBestSet(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseBestSet | null> {
    const BASE = `/api/statistics/exercises/${params.exerciseId}/best-set`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;

    const result = await response.json().catch(() => null);

    return result?.bestSet ?? null;
  }

  static async getExerciseOneRepMaxEstimate(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<number | null> {
    const BASE = `/api/statistics/exercises/${params.exerciseId}/one-rep-max-estimate`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;

    const result = await response.json().catch(() => null);

    return result?.estimate ?? null;
  }
}
