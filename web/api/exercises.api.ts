import { absoluteUrl, Cookies, type ETagValueType } from "@bgord/ui";
import type { ExerciseGetResponse } from "../../modules/exercises/queries/get-exercise-with-categories";
import type { ExerciseCategoryListResponse } from "../../modules/exercises/queries/list-exercise-categories";
import type { ExerciseListResponse } from "../../modules/exercises/queries/list-exercises-with-categories";

export type ExerciseImageEtagType = ETagValueType;

const unavailable = { available: false, enabled: false, hints: [] };

export class Exercises {
  static async list(request: Request | null): Promise<ExerciseListResponse> {
    const BASE = "/api/exercises/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { data: [], actions: { add: unavailable } };
    return response.json().catch();
  }

  static async get(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseGetResponse | null> {
    const BASE = `/api/exercises/${params.exerciseId}`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }

  static async getImageEtag(
    request: Request | null,
    params: { exerciseId: string },
  ): Promise<ExerciseImageEtagType | null> {
    const BASE = `/api/exercises/${params.exerciseId}/image`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.headers.get("etag");
  }

  static async listCategories(request: Request | null): Promise<ExerciseCategoryListResponse> {
    const BASE = "/api/exercises/category/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok)
      return { data: [], actions: { add: unavailable, rename: unavailable, delete: unavailable } };
    return response.json().catch();
  }
}
