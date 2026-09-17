// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { dashboardRoute } from "../router";
import { BodyWeightStats } from "../sections/body-weight-stats";

export function DashboardBodyWeightStats() {
  const t = bg.useTranslations();
  const { measurements } = dashboardRoute.useLoaderData();

  if (measurements.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <ui.EyebrowLink to="/measurements">{t("measurements.body_weight.header")}</ui.EyebrowLink>

      <BodyWeightStats measurements={measurements} />
    </div>
  );
}
