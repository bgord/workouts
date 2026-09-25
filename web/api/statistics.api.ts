import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { ApiClient } from "./api-client";

export class Statistics {
  static async getExercisePerformances(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<Array<ExercisePerformance>> {
    const result = await ApiClient.json<{ performances: Array<ExercisePerformance> }>(
      `/api/statistics/exercises/${params.exerciseId}/performances`,
      request,
      { performances: [] },
    );

    return result.performances;
  }
}
