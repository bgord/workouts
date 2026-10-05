import * as bg from "@bgord/ui";
import { SearchX } from "lucide-react";
import * as ui from "../components";

export function ExerciseNotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack to="/catalog" />

          <h1>{t("exercise.not_found")}</h1>
        </div>

        <ui.EmptyState>
          <ui.EmptyStateIcon icon={SearchX} />

          <ui.EmptyStateMessage>{t("exercise.not_found.hint")}</ui.EmptyStateMessage>

          <ui.EmptyStateLink to="/catalog">{t("exercise.not_found.cta")}</ui.EmptyStateLink>
        </ui.EmptyState>
      </div>
    </ui.Main>
  );
}
