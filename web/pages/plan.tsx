// fallow-ignore-file unused-export
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
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

  const format = (timestamp: number) =>
    Temporal.Instant.fromEpochMilliseconds(timestamp)
      .toZonedDateTimeISO(Temporal.Now.timeZoneId())
      .toLocaleString(language, { day: "numeric", month: "short", year: "numeric" });

  return (
    <Main>
      <Link className="c-link" to="/plans">
        {`< ${t("app.back")}`}
      </Link>

      {!plan && <div data-color="neutral-400">{t("plan.not_found")}</div>}

      {plan && (
        <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
          <div data-gap="1" data-grow="1" data-stack="y" style={{ minInlineSize: 0 }}>
            {plan.status === PlanStatusEnum.draft && <PlanRename {...plan} />}

            {plan.status !== PlanStatusEnum.draft && (
              <h1
                data-color="neutral-0"
                data-fs="2xl"
                data-fw="black"
                data-md-fs="xl"
                data-transform="truncate"
              >
                {plan.name}
              </h1>
            )}

            <div data-color="neutral-400" data-fs="sm">
              {t("plan.updated_at", { date: format(plan.updatedAt) })}
            </div>
          </div>

          <PlanStatusBadge status={plan.status} />
        </div>
      )}

      {plan && (
        <div data-cross="center" data-gap="3" data-stack="x" data-wrap="wrap">
          {plan.status === PlanStatusEnum.draft && <PlanFinalize {...plan} />}

          {plan.status === PlanStatusEnum.finalized && <PlanEditingEnable {...plan} />}

          {plan.status !== PlanStatusEnum.archived && <PlanArchive {...plan} />}

          {plan.status === PlanStatusEnum.archived && <PlanRestore {...plan} />}

          {plan.status !== PlanStatusEnum.finalized && <PlanRemove {...plan} />}
        </div>
      )}

      {plan && <PlanSectionList {...plan} />}
    </Main>
  );
}
