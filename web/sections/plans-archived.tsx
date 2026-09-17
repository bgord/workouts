// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { plansRoute } from "../router";

export function PlansArchived() {
  const t = bg.useTranslations();
  const { plans } = plansRoute.useLoaderData();

  if (plans.data.archived.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <ui.Eyebrow>{t("plan.list.archived.header")}</ui.Eyebrow>

      <ul data-opacity="high" data-stack="y" {...ui.Gap.cluster}>
        {plans.data.archived.map((plan) => (
          <ui.PlanCard key={plan.id} {...plan} />
        ))}
      </ul>
    </div>
  );
}
