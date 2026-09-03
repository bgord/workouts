import { absoluteUrl, Cookies } from "@bgord/ui";
import type { Plan } from "../../modules/plans/value-objects/plan";
import type { PlanSummary } from "../../modules/plans/value-objects/plan-summary";

export class Plans {
  static async list(request: Request | null): Promise<ReadonlyArray<PlanSummary>> {
    const BASE = "/api/plans/list";

    const url = absoluteUrl(BASE, request);
    const headers = request ? { cookie: Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return [];
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
