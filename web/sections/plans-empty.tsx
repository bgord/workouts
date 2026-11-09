import * as bg from "@bgord/ui";
import * as ui from "../components";
import { ClipboardList } from "../icons";
import { plansRoute } from "../router";

export function PlansEmpty() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  const empty = plans.data.active.length === 0 && plans.data.archived.length === 0;

  if (!empty) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={ClipboardList} />

      <ui.EmptyStateMessage>{t("plan.list.empty")}</ui.EmptyStateMessage>

      <small>{t("plan.list.empty.hint")}</small>
    </ui.EmptyState>
  );
}
