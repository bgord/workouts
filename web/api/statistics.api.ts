import { absoluteUrl, Cookies } from "@bgord/ui";

export type ExerciseSet = { id: string; workoutId: string; reps: number; load: number };

export type ExerciseOneRepMax = { set: ExerciseSet; estimate: number };

export class Statistics {
  static async getExerciseBestSet(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseSet | null> {
    const BASE = `/api/statistics/exercises/${params.exerciseId}/best-set`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;

    const result = await response.json().catch(() => null);

    return result?.bestSet ?? null;
  }

  static async getExerciseOneRepMax(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseOneRepMax | null> {
    const BASE = `/api/statistics/exercises/${params.exerciseId}/one-rep-max-estimate`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;

    const result = await response.json().catch(() => null);

    return result?.oneRepMax ?? null;
  }
}
