import * as bg from "@bgord/ui";

export class ApiClient {
  static async fetch(path: string, request: Request | null, init: RequestInit = {}): Promise<Response> {
    const url = bg.absoluteUrl(path, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    return fetch(url, { ...init, headers, credentials: "include" });
  }

  static async get<T>(path: string, request: Request | null, fallback: T): Promise<T> {
    const response = await ApiClient.fetch(path, request);

    if (!response.ok) return fallback;
    return response.json();
  }
}
