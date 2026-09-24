import type * as bg from "@bgord/ui";
import { ApiClient } from "./api-client";

export class I18N {
  static async get(request: Request | null): Promise<bg.TranslationsContextValueType | null> {
    return ApiClient.get<bg.TranslationsContextValueType | null>("/api/translations", request, null);
  }
}
