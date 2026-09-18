// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import * as ui from "../components";
import { planRoute } from "../router";
import * as Sections from "../sections";
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
            <Sections.PlanName />

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
            <Sections.PlanFinalize />

            <Sections.PlanEditingEnable />

            <Sections.PlanRestore />

            <div data-cross="center" data-ml="auto" data-stack="x" data-wrap="nowrap">
              <Sections.PlanArchive />

              <Sections.PlanRemove />
            </div>
          </div>
        </div>

        <div data-stack="y" {...ui.Spacing.inset} {...ui.Gap.related}>
          <ui.Meta truncate>
            {t("plan.updated_at", {
              date: DateFormat.dayWithTime(language, DateFormat.zoned(plan.data.updatedAt)),
            })}
          </ui.Meta>

          <Sections.PlanDescription />

          {plan.actions.finalize.available && <ui.ActionHint {...plan.actions.finalize} />}
        </div>
      </div>

      <Sections.PlanSectionList />
    </ui.Main>
  );
}
