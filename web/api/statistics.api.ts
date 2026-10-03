import * as bg from "@bgord/ui";
import type { ExercisePerformanceStatistics } from "../../modules/statistics/value-objects/exercise-performance-statistics";

export class Statistics {
  static async getExercisePerformances(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<Array<ExercisePerformanceStatistics>> {
    const result = await bg.ApiClient.json<{ performances: Array<ExercisePerformanceStatistics> }>(
      `/api/statistics/exercises/${params.exerciseId}/performances`,
      request,
      { performances: [] },
    );

    return result.performances;
  }
}
