import * as bg from "@bgord/ui";
import { catalogRoute } from "../router";
import { ExerciseCategoryAdd } from "./exercise-category-add";
import { ExerciseCategoryRename } from "./exercise-category-rename";

export function ExerciseCategoryManage() {
  const t = bg.useTranslations();
  const { exerciseCategories } = catalogRoute.useLoaderData();

  return (
    <div className="c-card" data-gap="4" data-stack="y">
      {exerciseCategories.actions.add.available && <ExerciseCategoryAdd />}

      {exerciseCategories.data.length === 0 && (
        <div data-color="neutral-400" data-fs="sm">
          {t("exercise.category.list.empty")}
        </div>
      )}

      <ul data-gap="2" data-stack="y">
        {exerciseCategories.data.map((category) => (
          <li data-cross="center" data-gap="3" data-stack="x" key={category.id}>
            {exerciseCategories.actions.rename.available ? (
              <ExerciseCategoryRename {...category} />
            ) : (
              <div data-grow="1">{category.name}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
