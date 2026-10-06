import * as bg from "@bgord/ui";
import * as ui from "../components";
import { useHydrated } from "../hooks/use-hydrated";
import { planRoute } from "../router";
import { PlanArchive } from "../sections/plan-archive";
import { PlanCopy } from "../sections/plan-copy";
import { PlanDescription } from "../sections/plan-description";
import { PlanName } from "../sections/plan-name";
import { PlanRemove } from "../sections/plan-remove";
import { PlanSectionList } from "../sections/plan-section-list";
import { PlanStatus } from "../sections/plan-status";
import { DateFormat } from "../services/date-format";

export function Plan() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const hydrated = useHydrated();
  const { plan } = planRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.block}>
        <div data-main="between" data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack to="/plans">{t("app.plans")}</ui.ButtonBack>

          <bg.Menu name="plan-menu">
            <ui.MenuTrigger />

            <bg.MenuContent>
              <PlanCopy />

              <PlanArchive />

              {plan.actions.remove.available && <bg.MenuSeparator />}

              <PlanRemove />

              <bg.MenuSeparator />

              <bg.MenuFooter>
                {t("plan.updated_at", {
                  date: DateFormat.dayWithTime(language, plan.data.updatedAt, hydrated ? undefined : "UTC"),
                })}
              </bg.MenuFooter>
            </bg.MenuContent>
          </bg.Menu>
        </div>

        <div data-stack="y" {...ui.Gap.inline}>
          <PlanName />

          <PlanDescription />
        </div>

        <PlanStatus />
      </div>

      <PlanSectionList />
    </ui.Main>
  );
}
