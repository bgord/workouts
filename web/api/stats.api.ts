import { absoluteUrl, Cookies } from "@bgord/ui";
import type { ExerciseHistory } from "../../modules/stats/value-objects/exercise-history";

export class Stats {
  static async getExerciseHistory(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseHistory> {
    const BASE = `/api/stats/exercise/${params.exerciseId}/history`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { sessions: [] };
    return response.json().catch();
  }
}
