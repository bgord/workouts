import { absoluteUrl, Cookies } from "@bgord/ui";
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
}
