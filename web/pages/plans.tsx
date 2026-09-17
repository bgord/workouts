// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { ClipboardList, Plus } from "lucide-react";
import * as ui from "../components";
import { plansRoute } from "../router";
import { PlanCreate } from "../sections/plan-create";

export function Plans() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  const planCreate = bg.useToggle({ name: "plan-create" });

  const empty = plans.data.active.length === 0;
  const fresh = empty && plans.data.archived.length === 0;

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("plan.list.header")}</ui.Header>

        <ui.ActionHint {...plans.actions.create} data-md-width="100%" />

        <button
          className="c-button"
          data-md-width="100%"
          data-variant="primary"
          disabled={!plans.actions.create.enabled}
          onClick={planCreate.enable}
          type="button"
          {...planCreate.props.controller}
        >
          <Plus data-size="sm" />
          {t("plan.create.cta")}
        </button>
      </div>

      {plans.actions.create.enabled && <PlanCreate {...planCreate} />}

      <div data-stack="y" {...ui.Gap.cluster}>
        <ui.Eyebrow>{t("plan.list.active.header")}</ui.Eyebrow>

        {empty && (
          <ui.EmptyState>
            <ui.EmptyStateIcon icon={ClipboardList} />

            <ui.EmptyStateMessage>
              {t(fresh ? "plan.list.empty" : "plan.list.empty.active")}
            </ui.EmptyStateMessage>

            <ui.Meta>{t(fresh ? "plan.list.empty.hint" : "plan.list.empty.active.hint")}</ui.Meta>
          </ui.EmptyState>
        )}

        {plans.data.active.length > 0 && (
          <ul data-stack="y" {...ui.Gap.cluster}>
            {plans.data.active.map((plan) => (
              <ui.PlanCard key={plan.id} {...plan} />
            ))}
          </ul>
        )}
      </div>

      {plans.data.archived.length > 0 && (
        <div data-stack="y" {...ui.Gap.cluster}>
          <ui.Eyebrow>{t("plan.list.archived.header")}</ui.Eyebrow>

          <ul data-opacity="high" data-stack="y" {...ui.Gap.cluster}>
            {plans.data.archived.map((plan) => (
              <ui.PlanCard key={plan.id} {...plan} />
            ))}
          </ul>
        </div>
      )}
    </ui.Main>
  );
}
