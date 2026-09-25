import type { AuthVariables } from "../../infra/tools/shield-auth.strategy";
import { ApiClient } from "./api-client";

export type SessionType = AuthVariables;

export class Session {
  static async get(request: Request | null): Promise<SessionType | null> {
    return ApiClient.json<SessionType | null>("/api/auth/get-session", request, null);
  }
}
