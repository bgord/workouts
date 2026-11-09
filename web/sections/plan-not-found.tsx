import * as bg from "@bgord/ui";
import * as ui from "../components";
import { SearchX } from "../icons";

export function PlanNotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack to="/plans" />

          <h1>{t("plan.not_found")}</h1>
        </div>

        <ui.EmptyState>
          <ui.EmptyStateIcon icon={SearchX} />

          <ui.EmptyStateMessage>{t("plan.not_found.hint")}</ui.EmptyStateMessage>

          <ui.EmptyStateLink to="/plans">{t("plan.not_found.cta")}</ui.EmptyStateLink>
        </ui.EmptyState>
      </div>
    </ui.Main>
  );
}
