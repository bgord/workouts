// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import { Plus, Tags } from "lucide-react";
import { ActionHint, Main } from "../components";
import { catalogRoute } from "../router";
import { ExerciseAdd } from "../sections/exercise-add";
import { ExerciseCatalog } from "../sections/exercise-catalog";
import { ExerciseCategoryManage } from "../sections/exercise-category-manage";

export function Catalog() {
  const t = bg.useTranslations();
  const { exercises, exerciseCategories } = catalogRoute.useLoaderData();
  const categoryManage = bg.useToggle({ name: "exercise-category-manage" });
  const exerciseAdd = bg.useToggle({ name: "exercise-add" });

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
        <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">
          {t("exercise.catalog.header")}
        </h1>

        <div data-cross="center" data-gap="3" data-md-width="100%" data-stack="x">
          {exerciseCategories.actions.add.available && (
            <>
              <ActionHint action={exerciseCategories.actions.add} />

              <button
                className="c-button"
                data-md-grow="1"
                data-variant="secondary"
                disabled={!exerciseCategories.actions.add.enabled}
                onClick={categoryManage.toggle}
                type="button"
              >
                <Tags data-size="sm" />
                {t("exercise.category.manage.cta")}
              </button>
            </>
          )}

          {exercises.actions.add.available && (
            <>
              <ActionHint action={exercises.actions.add} />

              <button
                className="c-button"
                data-md-grow="1"
                data-variant="primary"
                disabled={!exercises.actions.add.enabled}
                onClick={exerciseAdd.toggle}
                type="button"
              >
                <Plus data-size="sm" />
                {t("exercise.add.cta")}
              </button>
            </>
          )}
        </div>
      </div>

      {categoryManage.on && <ExerciseCategoryManage />}

      {exercises.actions.add.enabled && exerciseAdd.on && <ExerciseAdd />}

      <ExerciseCatalog />
    </Main>
  );
}
