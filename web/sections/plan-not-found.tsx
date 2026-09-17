// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";

export function PlanNotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <ui.LinkBack to="/plans" />

      <div data-color="neutral-400">{t("plan.not_found")}</div>
    </ui.Main>
  );
}
