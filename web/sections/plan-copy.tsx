import * as bg from "@bgord/ui";
import * as ui from "../components";
import { planRoute } from "../router";
import { PlanReport } from "../services/plan-report";

export function PlanCopy() {
  const t = bg.useTranslations();
  const { plan } = planRoute.useLoaderData();

  return (
    <ui.CopyMenuItem done={t("plan.copy.done")} text={() => PlanReport.create(plan.data)}>
      {t("plan.copy.cta")}
    </ui.CopyMenuItem>
  );
}
