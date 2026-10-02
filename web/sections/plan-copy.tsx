import * as bg from "@bgord/ui";
import { Check, Copy } from "lucide-react";
import * as ui from "../components";
import { planRoute } from "../router";
import { PlanReport } from "../services/plan-report";

export function PlanCopy() {
  const t = bg.useTranslations();
  const { plan } = planRoute.useLoaderData();

  const planCopy = bg.useToggle({ name: `plan-copy-${plan.data.id}` });

  return (
    <ui.IconButton
      aria-label={t("plan.copy.cta")}
      onClick={() =>
        bg.Clipboard.copy({
          text: PlanReport.create(plan.data),
          onSuccess: () => {
            planCopy.enable();
            setTimeout(planCopy.disable, 2000);
          },
        })
      }
      title={planCopy.on ? t("plan.copy.done") : t("plan.copy.title")}
      tone={planCopy.on ? "brand" : "neutral"}
    >
      {planCopy.on ? <Check data-size="sm" /> : <Copy data-size="sm" />}
    </ui.IconButton>
  );
}
