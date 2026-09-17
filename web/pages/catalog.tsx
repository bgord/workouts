// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import * as ui from "../components";
import * as Sections from "../sections";

export function Catalog() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("exercise.catalog.header")}</ui.Header>

        <div data-cross="center" data-md-width="100%" data-stack="x" {...ui.Gap.cluster}>
          <Sections.ExerciseCategoryManage />

          <Sections.ExerciseAdd />
        </div>
      </div>

      <Sections.ExerciseCatalog />
    </ui.Main>
  );
}
