// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import * as ui from "../components";

export function ExerciseNotFound() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <ui.LinkBack search={Form.default} to="/catalog" />

      <div data-color="neutral-400">{t("exercise.not_found")}</div>
    </ui.Main>
  );
}
