// fallow-ignore-file unused-export

import * as bg from "@bgord/ui";
import { Tags } from "lucide-react";
import { ActionHint, Main } from "../components";
import { catalogRoute } from "../router";
import { ExerciseCatalog } from "../sections/exercise-catalog";
import { ExerciseCategoryManage } from "../sections/exercise-category-manage";

export function Catalog() {
  const t = bg.useTranslations();
  const { exerciseCategories } = catalogRoute.useLoaderData();
  const categoryManage = bg.useToggle({ name: "exercise-category-manage" });

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-main="between" data-stack="x">
        <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-md-fs="xl">
          {t("exercise.catalog.header")}
        </h1>

        {exerciseCategories.actions.add.available && (
          <div data-cross="center" data-gap="3" data-stack="x">
            <ActionHint action={exerciseCategories.actions.add} />

            <button
              className="c-button"
              data-variant="secondary"
              disabled={!exerciseCategories.actions.add.enabled}
              onClick={categoryManage.toggle}
              type="button"
            >
              <Tags data-size="sm" />
              {t("exercise.category.manage.cta")}
            </button>
          </div>
        )}
      </div>

      {categoryManage.on && <ExerciseCategoryManage />}

      <ExerciseCatalog />
    </Main>
  );
}
