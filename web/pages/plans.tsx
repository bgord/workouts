// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { ClipboardList, Plus } from "lucide-react";
import {
  ActionHint,
  EmptyState,
  EmptyStateIcon,
  EmptyStateMessage,
  Eyebrow,
  Header,
  Main,
  Meta,
  PlanCard,
} from "../components";
import { plansRoute } from "../router";
import { PlanCreate } from "../sections/plan-create";

export function Plans() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  const planCreate = bg.useToggle({ name: "plan-create" });

  const empty = plans.data.active.length === 0;
  const fresh = empty && plans.data.archived.length === 0;

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-stack="x">
        <Header data-grow="1">{t("plan.list.header")}</Header>

        <ActionHint {...plans.actions.create} data-md-width="100%" />

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

      <div data-gap="2" data-stack="y">
        <Eyebrow>{t("plan.list.active.header")}</Eyebrow>

        {empty && (
          <EmptyState>
            <EmptyStateIcon icon={ClipboardList} />

            <EmptyStateMessage>{t(fresh ? "plan.list.empty" : "plan.list.empty.active")}</EmptyStateMessage>

            <Meta>{t(fresh ? "plan.list.empty.hint" : "plan.list.empty.active.hint")}</Meta>
          </EmptyState>
        )}

        {plans.data.active.length > 0 && (
          <ul data-gap="2" data-stack="y">
            {plans.data.active.map((plan) => (
              <PlanCard key={plan.id} {...plan} />
            ))}
          </ul>
        )}
      </div>

      {plans.data.archived.length > 0 && (
        <div data-gap="2" data-stack="y">
          <div data-cross="center" data-gap="2" data-stack="x">
            <Eyebrow data-grow="1">{t("plan.list.archived.header")}</Eyebrow>
          </div>

          <ul data-gap="2" data-opacity="high" data-stack="y">
            {plans.data.archived.map((plan) => (
              <PlanCard key={plan.id} {...plan} />
            ))}
          </ul>
        </div>
      )}
    </Main>
  );
}
