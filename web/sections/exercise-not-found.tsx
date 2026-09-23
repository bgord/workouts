// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import * as ui from "../components";

export function ExerciseNotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="y" {...ui.Gap.related}>
        <div data-stack="x" {...ui.Gap.related}>
          <ui.ButtonBack search={Form.default} to="/catalog" />

          <h1>{t("exercise.not_found")}</h1>
        </div>

        <div data-stack="y" {...ui.Spacing.inset} {...ui.Gap.related}>
          <ui.Meta>{t("exercise.not_found.hint")}</ui.Meta>

          <Link className="c-link" data-fs="sm" data-mr="auto" search={Form.default} to="/catalog">
            {t("exercise.not_found.cta")}
          </Link>
        </div>
      </div>
    </ui.Main>
  );
}
