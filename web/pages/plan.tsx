// fallow-ignore-file unused-export

import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { DateFormat } from "../../app/services/date-format";
import { Main, PlanStatusBadge } from "../components";
import { planRoute } from "../router";
import { PlanArchive } from "../sections/plan-archive";
import { PlanEditingEnable } from "../sections/plan-editing-enable";
import { PlanFinalize } from "../sections/plan-finalize";
import { PlanRemove } from "../sections/plan-remove";
import { PlanRename } from "../sections/plan-rename";
import { PlanRestore } from "../sections/plan-restore";
import { PlanSectionList } from "../sections/plan-section-list";

export function Plan() {
  const t = useTranslations();
  const language = useLanguage();
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
      <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
        <Link
          aria-label={t("app.back")}
          className="c-button"
          data-interaction="subtle-scale"
          data-self="start"
          data-variant="icon"
          title={t("app.back")}
          to="/plans"
        >
          <ChevronLeft data-size="md" />
        </Link>
        <div data-gap="1" data-grow="1" data-stack="y">
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

          <div data-color="neutral-400" data-fs="sm">
            {t("plan.updated_at", {
              date: DateFormat.dayWithTime(language, DateFormat.zoned(plan.data.updatedAt)),
            })}
          </div>
        </div>

        <PlanStatusBadge status={plan.data.status} />
      </div>

      <div data-cross="center" data-gap="3" data-stack="x" data-wrap="wrap">
        {plan.actions.finalize.available && <PlanFinalize action={plan.actions.finalize} {...plan.data} />}
        {plan.actions.editingEnable.available && <PlanEditingEnable {...plan.data} />}
        {plan.actions.archive.available && <PlanArchive {...plan.data} />}
        {plan.actions.restore.available && <PlanRestore {...plan.data} />}
        {plan.actions.remove.available && <PlanRemove {...plan.data} />}
      </div>

      <PlanSectionList {...plan?.data} actions={plan.actions} />
    </Main>
  );
}
