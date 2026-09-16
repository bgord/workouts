// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
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

const title = { flexBasis: 0, minWidth: 0 };
const secondary = { marginLeft: "auto" };

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
        <div data-cross="center" data-gap="3" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap">
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

          <div data-cross="center" data-gap="3" data-grow="1" data-stack="x" data-wrap="nowrap" style={title}>
            {plan.actions.rename.available && <PlanRename {...plan.data} />}

            {!plan.actions.rename.available && (
              <h1
                data-color={plan.data.status === PlanStatusEnum.archived ? "neutral-300" : "neutral-0"}
                data-fs="2xl"
                data-fw="black"
                data-md-fs="xl"
                data-transform="truncate"
              >
                {plan.data.name}
              </h1>
            )}

            <div data-cross="center" data-self="start" data-stack="x" {...bg.Rhythm().times(3).style.height}>
              <PlanStatusBadge status={plan.data.status} />
            </div>
          </div>

          <div
            data-cross="center"
            data-gap="2"
            data-md-mt="1"
            data-md-pl="4"
            data-md-width="100%"
            data-shrink="0"
            data-stack="x"
            data-wrap="nowrap"
          >
            {plan.actions.finalize.available && (
              <PlanFinalize action={plan.actions.finalize} {...plan.data} />
            )}

            {plan.actions.editingEnable.available && <PlanEditingEnable {...plan.data} />}

            {plan.actions.restore.available && <PlanRestore {...plan.data} />}

            <div data-cross="center" data-stack="x" data-wrap="nowrap" style={secondary}>
              {plan.actions.archive.available && <PlanArchive {...plan.data} />}

              {plan.actions.remove.available && <PlanRemove {...plan.data} />}
            </div>
          </div>
        </div>

        <div data-gap="3" data-md-pl="4" data-pl="12" data-stack="y">
          <div data-color="neutral-500" data-fs="xs">
            {t("plan.updated_at", {
              date: DateFormat.dayWithTime(language, DateFormat.zoned(plan.data.updatedAt)),
            })}
          </div>

          <PlanDescription action={plan.actions.descriptionSet} {...plan.data} />

          {plan.actions.finalize.available && <ActionHint action={plan.actions.finalize} />}
        </div>
      </div>

      <PlanSectionList {...plan?.data} actions={plan.actions} />
    </Main>
  );
}
