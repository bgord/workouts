import * as bg from "@bgord/ui";
import * as ui from "../components";
import { List } from "../icons";
import { planRoute } from "../router";

export function PlanCategoryCoverageToggle(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { plan } = planRoute.useLoaderData();

  const { toggle } = bg.extractUseToggle(props);

  if (!plan.actions.coverageView.available) return null;

  return (
    <ui.IconButton
      aria-label={t("plan.coverage.toggle")}
      onClick={toggle.toggle}
      title={t("plan.coverage.toggle")}
      tone={toggle.on ? "brand" : "neutral"}
      {...toggle.props.controller}
    >
      <List data-size="sm" />
    </ui.IconButton>
  );
}
