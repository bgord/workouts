// fallow-ignore-file unused-export
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
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

  if (!plan?.data) {
    return (
      <Main>
        <Link className="c-link" to="/plans">
          {`< ${t("app.back")}`}
        </Link>

        <div data-color="neutral-400">{t("plan.not_found")}</div>
      </Main>
    );
  }

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
        <div data-gap="1" data-grow="1" data-stack="y" style={{ minInlineSize: 0 }}>
          {plan.actions.rename.enabled && <PlanRename {...plan.data} />}

          {!plan.actions.rename.enabled && (
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
            {t("plan.updated_at", { date: format(plan.data.updatedAt) })}
          </div>
        </div>

        <PlanStatusBadge status={plan.data.status} />
      </div>

      <div data-cross="center" data-gap="3" data-stack="x" data-wrap="wrap">
        {plan.actions.finalize.enabled && <PlanFinalize {...plan.data} />}
        {plan.actions.editingEnable.enabled && <PlanEditingEnable {...plan.data} />}
        {plan.actions.archive.enabled && <PlanArchive {...plan.data} />}
        {plan.actions.restore.enabled && <PlanRestore {...plan.data} />}
        {plan.actions.remove.enabled && <PlanRemove {...plan.data} />}
      </div>

      {plan.actions.finalize.hints.map((hint) => (
        <div data-color="neutral-400" data-fs="sm" key={hint}>
          {t(hint)}
        </div>
      ))}

      <PlanSectionList {...plan?.data} />
    </Main>
  );
}
