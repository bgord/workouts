import * as bg from "@bgord/ui";
import { Tags } from "lucide-react";
import { catalogRoute } from "../router";
import { ExerciseCategoryAdd } from "./exercise-category-add";
import { ExerciseCategoryDelete } from "./exercise-category-delete";
import { ExerciseCategoryRename } from "./exercise-category-rename";

export function ExerciseCategoryManage() {
  const t = bg.useTranslations();
  const { exerciseCategories } = catalogRoute.useLoaderData();

  return (
    <section className="c-card" data-gap="4" data-maxw="md" data-md-p="2-5" data-stack="y" data-width="100%">
      <div data-cross="center" data-gap="2" data-stack="x">
        <Tags data-color="neutral-400" data-size="sm" />

        <div className="c-card-title" data-grow="1">
          {t("exercise.category.manage.header")}
        </div>

        <div data-color="neutral-500" data-fs="sm" data-transform="font-variant-numeric">
          {exerciseCategories.data.length}
        </div>
      </div>

      {exerciseCategories.actions.add.available && <ExerciseCategoryAdd />}

      {exerciseCategories.data.length === 0 && (
        <div data-cross="center" data-gap="1" data-py="6" data-stack="y">
          <div data-color="neutral-300" data-fs="sm">
            {t("exercise.category.list.empty")}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("exercise.category.list.empty.hint")}
          </div>
        </div>
      )}

      {exerciseCategories.data.length > 0 && (
        <ul data-stack="y">
          {exerciseCategories.data.map((category) => (
            <li
              data-bc="neutral-800"
              data-cross="center"
              data-gap="2"
              data-hover-bg="alpha-subtle"
              data-main="between"
              data-md-px="0-5"
              data-px="2"
              data-py="1-5"
              data-stack="x"
              key={category.id}
            >
              {exerciseCategories.actions.rename.available ? (
                <ExerciseCategoryRename {...category} />
              ) : (
                <div data-fs="sm">{category.name}</div>
              )}

              {exerciseCategories.actions.delete.available && <ExerciseCategoryDelete {...category} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
