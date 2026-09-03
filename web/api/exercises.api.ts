import { absoluteUrl, Cookies } from "@bgord/ui";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";

export class Exercises {
  static async list(request: Request | null): Promise<ReadonlyArray<ExerciseWithCategories>> {
    const BASE = "/api/exercises/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }

  static async listCategories(request: Request | null): Promise<ReadonlyArray<ExerciseCategory>> {
    const BASE = "/api/exercises/category/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }
}
