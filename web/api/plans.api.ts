import { absoluteUrl, Cookies } from "@bgord/ui";
import type { PlanListResponse } from "../../modules/plans/queries/list-plans";
import type { Plan } from "../../modules/plans/value-objects/plan";

export class Plans {
  static async list(request: Request | null): Promise<PlanListResponse> {
    const BASE = "/api/plans/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return { data: [], hints: { create: null } };
    return response.json().catch();
  }

  static async get(request: Request | null, params: { planId: string }): Promise<Plan | null> {
    const BASE = `/api/plans/${params.planId}`;

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
