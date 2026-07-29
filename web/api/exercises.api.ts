import { absoluteUrl, Cookies } from "@bgord/ui";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import type { Exercise } from "../../modules/exercises/value-objects/exercise";

export class Exercises {
  static async listCategories(request: Request | null): Promise<ReadonlyArray<ExerciseCategory>> {
    const BASE = "/api/exercises/category/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }

  static async getCategory(
    request: Request | null,
    params: { exerciseCategoryId: string },
  ): Promise<(ExerciseCategory & { exercises: ReadonlyArray<Exercise> }) | null> {
    const BASE = `/api/exercises/category/${params.exerciseCategoryId}`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
