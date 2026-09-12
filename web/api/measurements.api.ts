import { absoluteUrl, Cookies } from "@bgord/ui";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";

export class Measurements {
  static async listBodyWeight(request: Request | null): Promise<ReadonlyArray<BodyWeightMeasurement>> {
    const BASE = "/api/measurements/body-weight/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
    return response.json().catch();
  }
}
