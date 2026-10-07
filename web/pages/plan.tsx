import * as bg from "@bgord/ui";
import * as ui from "../components";
import { planRoute } from "../router";
import { PlanArchive } from "../sections/plan-archive";
import { PlanCopy } from "../sections/plan-copy";
import { PlanDescription } from "../sections/plan-description";
import { PlanName } from "../sections/plan-name";
import { PlanRemove } from "../sections/plan-remove";
import { PlanSectionList } from "../sections/plan-section-list";
import { PlanStatus } from "../sections/plan-status";

export function Plan() {
  const t = bg.useTranslations();
  const { plan } = planRoute.useLoaderData();

  const planRename = bg.useToggle({ name: "plan-rename" });

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.block}>
        <div data-stack="y" {...ui.Gap.related}>
          <div data-cross="center" data-stack="x" {...ui.Gap.related}>
            <ui.ButtonBack to="/plans" />

            <div data-grow="1" data-minw="0">
              <PlanName {...planRename} />
            </div>

            {planRename.off && (
              <bg.Menu name="plan-menu">
                <ui.MenuTrigger />

                <bg.MenuContent>
                  <PlanCopy />

                  <PlanArchive />

                  <PlanRemove />

                  <bg.MenuSeparator />

                  <bg.MenuFooter>
                    {t("plan.updated_at")} <bg.DateTime format="ago" value={plan.data.updatedAt} />
                  </bg.MenuFooter>
                </bg.MenuContent>
              </bg.Menu>
            )}
          </div>

          <PlanDescription />
        </div>

        <PlanStatus />
      </div>

      <PlanSectionList />
    </ui.Main>
  );
}
