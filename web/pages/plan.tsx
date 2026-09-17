// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import * as ui from "../components";
import { planRoute } from "../router";
import { PlanArchive } from "../sections/plan-archive";
import { PlanDescription } from "../sections/plan-description";
import { PlanEditingEnable } from "../sections/plan-editing-enable";
import { PlanFinalize } from "../sections/plan-finalize";
import { PlanRemove } from "../sections/plan-remove";
import { PlanRename } from "../sections/plan-rename";
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
            data-cross="center"
            data-grow="1"
            data-stack="x"
            data-wrap="nowrap"
            style={{ flexBasis: 0, minWidth: 0 }}
            {...ui.Gap.related}
          >
            {plan.actions.rename.available && <PlanRename {...plan.data} />}

            {!plan.actions.rename.available && <ui.Header>{plan.data.name}</ui.Header>}

            <div data-cross="center" data-self="start" data-stack="x" {...bg.Rhythm().times(3).style.height}>
              <ui.PlanStatusBadge status={plan.data.status} />
            </div>
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
              date: DateFormat.dayWithTime(language, DateFormat.zoned(plan.data.updatedAt)),
            })}
          </ui.Meta>

          <PlanDescription action={plan.actions.descriptionSet} {...plan.data} />

          {plan.actions.finalize.available && <ui.ActionHint {...plan.actions.finalize} />}
        </div>
      </div>

      <PlanSectionList {...plan.data} actions={plan.actions} />
    </ui.Main>
  );
}
