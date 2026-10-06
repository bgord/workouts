import * as bg from "@bgord/ui";
import * as ui from "../components";
import { useHydrated } from "../hooks/use-hydrated";
import { planRoute } from "../router";
import { PlanArchive } from "../sections/plan-archive";
import { PlanCopy } from "../sections/plan-copy";
import { PlanDescription } from "../sections/plan-description";
import { PlanEditingEnable } from "../sections/plan-editing-enable";
import { PlanFinalize } from "../sections/plan-finalize";
import { PlanName } from "../sections/plan-name";
import { PlanRemove } from "../sections/plan-remove";
import { PlanRestore } from "../sections/plan-restore";
import { PlanSectionList } from "../sections/plan-section-list";
import { DateFormat } from "../services/date-format";

export function Plan() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const hydrated = useHydrated();
  const { plan } = planRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-main="between" data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack to="/plans">{t("app.plans")}</ui.ButtonBack>

          <ui.Menu name="plan-menu">
            <ui.MenuTrigger />

            <ui.MenuContent>
              <PlanCopy />

              <PlanArchive />

              {plan.actions.remove.available && <ui.MenuSeparator />}

              <PlanRemove />

              <ui.MenuSeparator />

              <ui.MenuFooter>
                {t("plan.updated_at", {
                  date: DateFormat.dayWithTime(language, plan.data.updatedAt, hydrated ? undefined : "UTC"),
                })}
              </ui.MenuFooter>
            </ui.MenuContent>
          </ui.Menu>
        </div>

        <PlanName />

        <PlanDescription />

        <div data-main="between" data-md-wrap="wrap" data-stack="x" {...ui.Gap.related}>
          <ui.PlanStatusBadge status={plan.data.status} />

          <div data-md-width="100%" data-shrink="0" data-stack="x" {...ui.Gap.cluster}>
            <PlanFinalize />

            <PlanEditingEnable />

            <PlanRestore />
          </div>
        </div>

        {plan.actions.finalize.available && (
          <ui.ActionHint {...plan.actions.finalize} id="plan-finalize-hint" />
        )}
        {plan.actions.restore.available && <ui.ActionHint {...plan.actions.restore} id="plan-restore-hint" />}
      </div>

      <PlanSectionList />
    </ui.Main>
  );
}
