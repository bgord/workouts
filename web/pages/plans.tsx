// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { ClipboardList, Plus } from "lucide-react";
import { ActionHint, Main, PlanCard } from "../components";
import { plansRoute } from "../router";
import { PlanCreate } from "../sections/plan-create";

export function Plans() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();
  const planCreate = bg.useToggle({ name: "plan-create" });

  const empty = plans.data.active.length === 0 && plans.data.archived.length === 0;

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-stack="x">
        <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-grow="1" data-md-fs="xl">
          {t("plan.list.header")}
        </h1>

        <ActionHint action={plans.actions.create} />

        <button
          className="c-button"
          data-variant="secondary"
          disabled={!plans.actions.create.enabled}
          onClick={planCreate.toggle}
          type="button"
        >
          <Plus data-size="sm" />
          {t("plan.create.cta")}
        </button>
      </div>

      {plans.actions.create.enabled && planCreate.on && <PlanCreate />}

      {empty && (
        <div className="c-card" data-cross="center" data-gap="1" data-py="8" data-stack="y">
          <ClipboardList data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("plan.list.empty")}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("plan.list.empty.hint")}
          </div>
        </div>
      )}

      {plans.data.active.length > 0 && (
        <ul data-gap="2" data-stack="y">
          {plans.data.active.map((plan) => (
            <PlanCard key={plan.id} {...plan} />
          ))}
        </ul>
      )}

      {plans.data.archived.length > 0 && (
        <div data-gap="2" data-stack="y">
          <div data-cross="center" data-gap="2" data-stack="x">
            <div
              data-color="neutral-500"
              data-fs="xs"
              data-grow="1"
              data-ls="wide"
              data-transform="uppercase"
            >
              {t("plan.list.archived.header")}
            </div>

            <div data-color="neutral-500" data-fs="sm" data-transform="font-variant-numeric">
              {plans.data.archived.length}
            </div>
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
