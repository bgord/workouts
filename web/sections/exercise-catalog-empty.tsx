import * as bg from "@bgord/ui";
import * as ui from "../components";
import { SearchX } from "../icons";

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
