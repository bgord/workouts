import * as bg from "@bgord/ui";
import * as ui from "../components";
import { plansRoute } from "../router";

export function PlansArchived() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  if (plans.data.archived.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{t("plan.list.archived.header")}</h3>

      <ul data-opacity="high" data-stack="y" {...ui.Gap.cluster}>
        {plans.data.archived.map((plan) => (
          <ui.PlanCard key={plan.id} {...plan} />
        ))}
      </ul>
    </div>
  );
}
