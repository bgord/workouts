import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import type { BodyWeightStats } from "../../modules/measurements/value-objects/body-weight-stats";
import { ApiClient } from "./api-client";

type BodyWeightListResponse = {
  measurements: ReadonlyArray<BodyWeightMeasurement>;
  stats: BodyWeightStats | null;
};

export class Measurements {
  static async listBodyWeight(request: Request | null): Promise<BodyWeightListResponse> {
    return ApiClient.get<BodyWeightListResponse>("/api/measurements/body-weight/list", request, {
      measurements: [],
      stats: null,
    });
  }
}
