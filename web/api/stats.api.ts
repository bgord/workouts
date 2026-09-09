import { absoluteUrl, Cookies } from "@bgord/ui";
import type { ExerciseHistoryGetResponse } from "../../app/http/stats/exercise-history-get";

export class Stats {
  static async getExerciseHistory(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseHistoryGetResponse> {
    const BASE = `/api/stats/exercise/${params.exerciseId}/history`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { sessions: [] };
    return response.json().catch();
  }
}
