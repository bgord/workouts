import * as bg from "@bgord/ui";
import type { ExerciseStatistics } from "../../modules/statistics/value-objects/exercise-statistics";

export class Statistics {
  static async getExercisePerformances(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseStatistics> {
    return bg.ApiClient.json<ExerciseStatistics>(
      `/api/statistics/exercises/${params.exerciseId}/performances`,
      request,
      { performances: [], records: null },
    );
  }
}
