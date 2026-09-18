import * as bg from "@bgord/ui";
import type { AuthVariables } from "../../infra/tools/shield-auth.strategy";

export type SessionType = AuthVariables;

export class Session {
  private static readonly BASE = "/api/auth/get-session";

  static async get(request: Request | null): Promise<SessionType | null> {
    const url = bg.absoluteUrl(Session.BASE, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.json().catch();
  }
}
