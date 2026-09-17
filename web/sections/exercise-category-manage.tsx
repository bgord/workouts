import * as bg from "@bgord/ui";
import * as ui from "../components";
import { catalogRoute } from "../router";
import { ExerciseCategoryAdd } from "./exercise-category-add";
import { ExerciseCategoryRow } from "./exercise-category-row";

export function ExerciseCategoryManage(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { exerciseCategories } = catalogRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);

  return (
    <ui.Dialog {...toggle}>
      <ui.DialogHeader onClose={toggle.disable}>{t("exercise.category.manage.header")}</ui.DialogHeader>

      {exerciseCategories.actions.add.available && <ExerciseCategoryAdd />}

      {exerciseCategories.data.length === 0 && (
        <div data-cross="center" data-gap="1" data-py="6" data-stack="y">
          <div data-color="neutral-300" data-fs="sm">
            {t("exercise.category.list.empty")}
          </div>

          <ui.Meta>{t("exercise.category.list.empty.hint")}</ui.Meta>
        </div>
      )}

      {exerciseCategories.data.length > 0 && (
        <ul data-stack="y">
          {exerciseCategories.data.map((category) => (
            <ExerciseCategoryRow key={category.id} {...category} />
          ))}
        </ul>
      )}
    </ui.Dialog>
  );
}
