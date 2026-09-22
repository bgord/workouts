// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import * as ui from "../components";
import { planRoute } from "../router";
import { PlanArchive } from "../sections/plan-archive";
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
  const { plan } = planRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-cross="center" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
          <ui.ButtonBack to="/plans" />

          <div
            data-basis="0"
            data-cross="center"
            data-grow="1"
            data-minw="0"
            data-stack="x"
            data-wrap="nowrap"
            {...ui.Gap.related}
          >
            <PlanName />

            <ui.PlanStatusBadge status={plan.data.status} />
          </div>

          <div
            data-cross="center"
            data-md-width="100%"
            data-shrink="0"
            data-stack="x"
            data-wrap="nowrap"
            {...ui.Gap.cluster}
          >
            <PlanFinalize />

            <PlanEditingEnable />

            <PlanRestore />

            <div data-cross="center" data-ml="auto" data-stack="x" data-wrap="nowrap">
              <PlanArchive />

              <PlanRemove />
            </div>
          </div>
        </div>

        <div data-stack="y" {...ui.Spacing.inset} {...ui.Gap.related}>
          <ui.Meta truncate>
            {t("plan.updated_at", {
              date: DateFormat.dayWithTime(language, plan.data.updatedAt),
            })}
          </ui.Meta>

          <PlanDescription />

          {plan.actions.finalize.available && <ui.ActionHint {...plan.actions.finalize} />}
          {plan.actions.restore.available && <ui.ActionHint {...plan.actions.restore} />}
        </div>
      </div>

      <PlanSectionList />
    </ui.Main>
  );
}
