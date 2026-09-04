// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import { Main, PlanCard } from "../components";
import { plansRoute } from "../router";
import { PlanCreate } from "../sections/plan-create";

export function Plans() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();
  const planCreate = bg.useToggle({ name: "plan-create" });

  const active = plans.filter((plan) => plan.status !== PlanStatusEnum.archived);
  const archived = plans.filter((plan) => plan.status === PlanStatusEnum.archived);

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
        <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">{t("plan.list.header")}</h1>

        {active.length === 0 && (
          <button className="c-button" data-variant="bare" onClick={planCreate.toggle} type="button">
            {t("plan.create.cta")}
          </button>
        )}
      </div>

      {active.length > 0 && (
        <div data-color="neutral-500" data-fs="sm">
          {t("plan.list.limit.hint")}
        </div>
      )}

      {active.length === 0 && planCreate.on && <PlanCreate />}

      {active.length === 0 && archived.length === 0 && (
        <div data-color="neutral-500">{t("plan.list.empty")}</div>
      )}

      {active.length > 0 && (
        <ul data-gap="3" data-stack="y">
          {active.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </ul>
      )}

      {archived.length > 0 && (
        <div data-gap="3" data-stack="y">
          <h2 data-color="neutral-400" data-fs="xs" data-fw="bold" data-lh="none" data-ls="widest" data-transform="uppercase">
            {t("plan.list.archived.header")}
          </h2>

          <ul data-gap="3" data-stack="y">
            {archived.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </ul>
        </div>
      )}
    </Main>
  );
}
