import * as bg from "@bgord/ui";
import * as ui from "../components";
import { plansRoute } from "../router";
import { PlansActiveEmpty } from "./plans-active-empty";

export function PlansActive() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <PlansActiveEmpty />

      {plans.data.active.length > 0 && (
        <>
          <h3>{t("plan.list.active.header")}</h3>
          <ul data-stack="y" {...ui.Gap.cluster}>
            {plans.data.active.map((plan) => (
              <ui.PlanCard key={plan.id} {...plan} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
