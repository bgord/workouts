import * as bg from "@bgord/ui";
import { SearchX } from "lucide-react";
import * as ui from "../components";

export function WorkoutHistoryEmpty() {
  const t = bg.useTranslations();

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={SearchX} />

      <ui.EmptyStateMessage>{t("workout.list.no_matches")}</ui.EmptyStateMessage>

      <small>{t("workout.list.no_matches.hint")}</small>
    </ui.EmptyState>
  );
}
