import * as bg from "@bgord/ui";
import type { ExerciseGetResponse } from "../../modules/exercises/queries/get-exercise-with-categories";
import type { ExerciseCategoryListResponse } from "../../modules/exercises/queries/list-exercise-categories";
import type { ExerciseListResponse } from "../../modules/exercises/queries/list-exercises-with-categories";

const unavailable = { available: false, enabled: false, hints: [] };

export class Exercises {
  static async list(request: Request | null): Promise<ExerciseListResponse> {
    const BASE = "/api/exercises/list";

    const url = bg.absoluteUrl(BASE, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { data: [], actions: { add: unavailable } };
    return response.json().catch();
  }

  static async get(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseGetResponse | null> {
    const BASE = `/api/exercises/${params.exerciseId}`;

    const url = bg.absoluteUrl(BASE, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }

  static async listCategories(request: Request | null): Promise<ExerciseCategoryListResponse> {
    const BASE = "/api/exercises/category/list";

    const url = bg.absoluteUrl(BASE, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok)
      return {
        data: [],
        actions: { manage: unavailable, add: unavailable, rename: unavailable, delete: unavailable },
      };
    return response.json().catch();
  }
}
