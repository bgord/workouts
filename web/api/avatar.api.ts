import type * as bg from "@bgord/ui";
import { ApiClient } from "./api-client";

export type AvatarEtagType = bg.ETagValueType;

export class Avatar {
  static async getEtag(request: Request | null): Promise<AvatarEtagType | null> {
    const response = await ApiClient.fetch("/api/profile-avatar/get", request);

    if (!response.ok) return null;
    return response.headers.get("etag");
  }
}
