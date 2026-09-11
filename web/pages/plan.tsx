// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ClipboardList } from "lucide-react";
import { ActionHint, Main, PlanStatusBadge } from "../components";
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

  if (!plan?.data) {
    return (
      <Main>
        <Link className="c-link" data-cross="center" data-gap="1" data-stack="x" to="/plans">
          <ChevronLeft data-size="sm" />
          {t("app.back")}
        </Link>

        <div data-color="neutral-400">{t("plan.not_found")}</div>
      </Main>
    );
  }

  return (
    <Main>
      <div data-gap="3" data-stack="y">
        <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
          <Link
            aria-label={t("app.back")}
            className="c-button"
            data-interaction="subtle-scale"
            data-self="start"
            data-shrink="0"
            data-variant="icon"
            title={t("app.back")}
            to="/plans"
          >
            <ChevronLeft data-size="md" />
          </Link>

          <div data-gap="0-5" data-grow="1" data-stack="y" {...bg.Rhythm().times(0).style.minWidth}>
            <div data-cross="center" data-gap="2" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap">
              <div data-gap="0-5" data-grow="1" data-stack="y" {...bg.Rhythm().times(0).style.minWidth}>
                <div
                  data-cross="center"
                  data-gap="2"
                  data-stack="x"
                  data-wrap="nowrap"
                  {...bg.Rhythm().times(3).style.minHeight}
                >
                  <ClipboardList data-color="neutral-400" data-shrink="0" data-size="md" />

                  {plan.actions.rename.available && <PlanRename {...plan.data} />}

                  {!plan.actions.rename.available && (
                    <h1
                      data-color="neutral-0"
                      data-fs="2xl"
                      data-fw="black"
                      data-md-fs="xl"
                      data-transform="truncate"
                    >
                      {plan.data.name}
                    </h1>
                  )}
                </div>

                <div data-color="neutral-500" data-fs="xs">
                  {t("plan.updated_at", {
                    date: DateFormat.dayWithTime(language, DateFormat.zoned(plan.data.updatedAt)),
                  })}
                </div>
              </div>

              <div
                data-cross="center"
                data-gap="2"
                data-md-width="100%"
                data-self="start"
                data-stack="x"
                data-wrap="nowrap"
                {...bg.Rhythm().times(3).style.height}
              >
                <PlanStatusBadge data-mr="4" status={plan.data.status} />

                {plan.actions.finalize.available && (
                  <PlanFinalize action={plan.actions.finalize} {...plan.data} />
                )}

                {plan.actions.editingEnable.available && <PlanEditingEnable {...plan.data} />}

                {plan.actions.restore.available && <PlanRestore {...plan.data} />}

                {plan.actions.archive.available && <PlanArchive {...plan.data} />}

                {plan.actions.remove.available && <PlanRemove {...plan.data} />}
              </div>
            </div>

            {plan.actions.finalize.available && (
              <ActionHint action={plan.actions.finalize} data-md-ml="0" data-md-mt="3" data-ml="auto" />
            )}

            <PlanDescription action={plan.actions.descriptionSet} {...plan.data} />
          </div>
        </div>
      </div>

      <PlanSectionList {...plan?.data} actions={plan.actions} />
    </Main>
  );
}
