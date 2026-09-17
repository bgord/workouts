// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { ClipboardList } from "lucide-react";
import * as ui from "../components";
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

      <ui.Meta>{t("plan.list.empty.hint")}</ui.Meta>
    </ui.EmptyState>
  );
}
