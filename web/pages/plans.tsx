// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { plansRoute } from "../router";
import { PlanCreate } from "../sections/plan-create";
import { PlansActiveEmpty } from "../sections/plans-active-empty";
import { PlansEmpty } from "../sections/plans-empty";

export function Plans() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("plan.list.header")}</ui.Header>

        <PlanCreate />
      </div>

      <PlansEmpty />

      <div data-stack="y" {...ui.Gap.cluster}>
        <ui.Eyebrow>{t("plan.list.active.header")}</ui.Eyebrow>

        <PlansActiveEmpty />

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
