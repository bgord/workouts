import * as bg from "@bgord/ui";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";

type BodyWeightListResponse = {
  measurements: ReadonlyArray<BodyWeightMeasurement>;
  stats: BodyWeightStats | null;
};

export class Measurements {
  static async listBodyWeight(request: Request | null): Promise<BodyWeightListResponse> {
    const BASE = "/api/measurements/body-weight/list";

    const url = bg.absoluteUrl(BASE, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { measurements: [], stats: null };
    return response.json().catch();
  }
}
