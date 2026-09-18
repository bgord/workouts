// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import * as ui from "../components";

export function PlanNotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
          <ui.ButtonBack to="/plans" />

          <ui.Header>{t("plan.not_found")}</ui.Header>
        </div>

        <div data-stack="y" {...ui.Spacing.inset} {...ui.Gap.related}>
          <ui.Meta>{t("plan.not_found.hint")}</ui.Meta>

          <Link className="c-link" data-fs="sm" data-mr="auto" to="/plans">
            {t("plan.not_found.cta")}
          </Link>
        </div>
      </div>
    </ui.Main>
  );
}
