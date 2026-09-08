// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { ActionHints, Main, PlanCard } from "../components";
import { plansRoute } from "../router";
import { PlanCreate } from "../sections/plan-create";

export function Plans() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();
  const planCreate = bg.useToggle({ name: "plan-create" });

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
        <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">
          {t("plan.list.header")}
        </h1>

        <div data-cross="center" data-gap="3" data-stack="x">
          <ActionHints action={plans.actions.create} />

          <button
            className="c-button"
            data-variant="secondary"
            disabled={!plans.actions.create.enabled}
            onClick={planCreate.toggle}
            type="button"
          >
            {t("plan.create.cta")}
          </button>
        </div>
      </div>

      {plans.actions.create.enabled && planCreate.on && <PlanCreate />}

      {plans.data.active.length === 0 && plans.data.archived.length === 0 && (
        <div data-color="neutral-400">{t("plan.list.empty")}</div>
      )}

      {plans.data.active.length > 0 && (
        <ul data-gap="3" data-stack="y">
          {plans.data.active.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </ul>
      )}

      {plans.data.archived.length > 0 && (
        <div data-gap="3" data-stack="y">
          <h2
            data-color="neutral-300"
            data-fs="xs"
            data-fw="bold"
            data-lh="none"
            data-ls="widest"
            data-transform="uppercase"
          >
            {t("plan.list.archived.header")}
          </h2>

          <ul data-gap="3" data-stack="y">
            {plans.data.archived.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </ul>
        </div>
      )}
    </Main>
  );
}
