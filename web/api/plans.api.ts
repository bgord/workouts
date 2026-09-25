import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";
import type { PlanListResponse } from "../../modules/plans/queries/list-plans";
import { ApiClient } from "./api-client";

export class Plans {
  static async list(request: Request | null): Promise<PlanListResponse> {
    return ApiClient.json<PlanListResponse>("/api/plans/list", request, {
      data: { active: [], archived: [] },
      actions: { create: { available: true, enabled: false, hints: [] } },
    });
  }

  static async get(request: Request | null, params: { planId: string }): Promise<PlanGetResponse | null> {
    return ApiClient.json<PlanGetResponse | null>(`/api/plans/${params.planId}`, request, null);
  }
}
