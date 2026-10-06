import * as bg from "@bgord/ui";
import { Ruler } from "lucide-react";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

export function BodyPartsEmpty() {
  const t = bg.useTranslations();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  if (bodyParts.data.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Ruler} />

      <ui.EmptyStateMessage>{t("measurements.body_parts.list.empty")}</ui.EmptyStateMessage>

      <small>{t("measurements.body_parts.empty.hint")}</small>
    </ui.EmptyState>
  );
}
