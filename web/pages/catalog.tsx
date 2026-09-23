// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import * as ui from "../components";
import { ExerciseAdd } from "../sections/exercise-add";
import { ExerciseCatalog } from "../sections/exercise-catalog";
import { ExerciseCategoryManage } from "../sections/exercise-category-manage";

export function Catalog() {
  const t = bg.useTranslations();

  return (
    <ui.Main>
      <div data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
        <h1 data-grow="1">{t("exercise.catalog.header")}</h1>

        <div data-md-width="100%" data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          <ExerciseCategoryManage />

          <ExerciseAdd />
        </div>
      </div>

      <ExerciseCatalog />
    </ui.Main>
  );
}
