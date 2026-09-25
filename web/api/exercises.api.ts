import type { ExerciseGetResponse } from "../../modules/exercises/queries/get-exercise-with-categories";
import type { ExerciseCategoryListResponse } from "../../modules/exercises/queries/list-exercise-categories";
import type { ExerciseListResponse } from "../../modules/exercises/queries/list-exercises-with-categories";
import { ApiClient } from "./api-client";

const unavailable = { available: false, enabled: false, hints: [] };

export class Exercises {
  static async list(request: Request | null): Promise<ExerciseListResponse> {
    return ApiClient.json<ExerciseListResponse>("/api/exercises/list", request, {
      data: [],
      actions: { add: unavailable },
    });
  }

  static async get(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseGetResponse | null> {
    return ApiClient.json<ExerciseGetResponse | null>(`/api/exercises/${params.exerciseId}`, request, null);
  }

  static async listCategories(request: Request | null): Promise<ExerciseCategoryListResponse> {
    return ApiClient.json<ExerciseCategoryListResponse>("/api/exercises/category/list", request, {
      data: [],
      actions: { manage: unavailable, add: unavailable, rename: unavailable, delete: unavailable },
    });
  }
}
