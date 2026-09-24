import * as bg from "@bgord/ui";

type ServerFetcher = (request: Request) => Response | Promise<Response>;

const forwarded = ["cookie", "user-agent", "x-real-ip", "x-forwarded-for"];

export class ApiClient {
  private static server: ServerFetcher | null = null;

  static useServer(fetcher: ServerFetcher): void {
    ApiClient.server = fetcher;
  }

  static async fetch(path: string, request: Request | null, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);

    for (const name of forwarded) {
      const value = request?.headers.get(name);
      if (value) headers.set(name, value);
    }

    if (request && ApiClient.server) {
      return ApiClient.server(new Request(new URL(path, request.url), { ...init, headers }));
    }

    return fetch(bg.absoluteUrl(path, request), { ...init, headers, credentials: "include" });
  }

  static async get<T>(path: string, request: Request | null, fallback: T): Promise<T> {
    const response = await ApiClient.fetch(path, request);

    if (!response.ok) return fallback;
    return response.json();
  }
}
