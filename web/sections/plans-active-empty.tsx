import * as bg from "@bgord/ui";
import * as ui from "../components";
import { ClipboardList } from "../icons";
import { plansRoute } from "../router";

export function PlansActiveEmpty() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  const empty = plans.data.active.length === 0 && plans.data.archived.length > 0;

  if (!empty) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={ClipboardList} />

      <ui.EmptyStateMessage>{t("plan.list.empty.active")}</ui.EmptyStateMessage>

      <small>{t("plan.list.empty.active.hint")}</small>
    </ui.EmptyState>
  );
}
