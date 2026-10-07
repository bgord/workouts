import * as bg from "@bgord/ui";
import { SearchX } from "lucide-react";
import * as ui from "../components";

export function ExerciseCatalogEmpty() {
  const t = bg.useTranslations();

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={SearchX} />

      <ui.EmptyStateMessage>{t("exercise.catalog.no_matches")}</ui.EmptyStateMessage>

      <small>{t("exercise.catalog.no_matches.hint")}</small>
    </ui.EmptyState>
  );
}
