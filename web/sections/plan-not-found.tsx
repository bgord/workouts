// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import * as ui from "../components";

export function PlanNotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack to="/plans" />

          <h1>{t("plan.not_found")}</h1>
        </div>

        <div data-stack="y" {...ui.Spacing.inset} {...ui.Gap.related}>
          <small>{t("plan.not_found.hint")}</small>

          <Link className="c-link" data-fs="sm" data-mr="auto" to="/plans">
            {t("plan.not_found.cta")}
          </Link>
        </div>
      </div>
    </ui.Main>
  );
}
