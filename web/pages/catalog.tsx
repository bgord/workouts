// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import { Plus, Tags } from "lucide-react";
import * as ui from "../components";
import { catalogRoute } from "../router";
import { ExerciseAdd } from "../sections/exercise-add";
import { ExerciseCatalog } from "../sections/exercise-catalog";
import { ExerciseCategoryManage } from "../sections/exercise-category-manage";

export function Catalog() {
  const t = bg.useTranslations();
  const { exercises, exerciseCategories } = catalogRoute.useLoaderData();

  const exerciseCategoryManage = bg.useToggle({ name: "exercise-category-manage" });
  const exerciseAdd = bg.useToggle({ name: "exercise-add" });

  return (
    <ui.Main>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <ui.Header data-grow="1">{t("exercise.catalog.header")}</ui.Header>

        <div data-cross="center" data-md-width="100%" data-stack="x" {...ui.Gap.cluster}>
          {exerciseCategories.actions.add.available && (
            <>
              <ui.ActionHint {...exerciseCategories.actions.add} />

              <button
                className="c-button"
                data-md-grow="1"
                data-variant="ghost"
                disabled={!exerciseCategories.actions.add.enabled}
                onClick={exerciseCategoryManage.enable}
                type="button"
                {...exerciseCategoryManage.props.controller}
              >
                <Tags data-size="sm" />
                {t("exercise.category.manage.cta")}
              </button>
            </>
          )}

          {exercises.actions.add.available && (
            <>
              <ui.ActionHint {...exercises.actions.add} />

              <button
                className="c-button"
                data-md-grow="1"
                data-variant="primary"
                disabled={!exercises.actions.add.enabled}
                onClick={exerciseAdd.enable}
                type="button"
                {...exerciseAdd.props.controller}
              >
                <Plus data-size="sm" />
                {t("exercise.add.cta")}
              </button>
            </>
          )}
        </div>
      </div>

      <ExerciseCategoryManage {...exerciseCategoryManage} />

      {exercises.actions.add.enabled && <ExerciseAdd {...exerciseAdd} />}

      <ExerciseCatalog />
    </ui.Main>
  );
}
