import * as bg from "@bgord/ui";

export type AvatarEtagType = bg.ETagValueType;

export class Avatar {
  private static readonly BASE = "/api/profile-avatar/get";

  static async getEtag(request: Request | null): Promise<AvatarEtagType | null> {
    const url = bg.absoluteUrl(Avatar.BASE, request);
    const headers = request ? { cookie: bg.Cookies.extractFrom(request) } : undefined;

    const response = await fetch(url, { headers, credentials: "include" });

    if (!response?.ok) return null;
    return response.headers.get("etag");
  }
}
