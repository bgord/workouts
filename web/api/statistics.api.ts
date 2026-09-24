import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { ApiClient } from "./api-client";

export class Statistics {
  static async getExercisePerformances(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<Array<ExercisePerformance>> {
    const response = await ApiClient.fetch(
      `/api/statistics/exercises/${params.exerciseId}/performances`,
      request,
    );

    if (!response.ok) return [];

    const result = await response.json().catch(() => null);

    return result?.performances ?? [];
  }
}
