import * as bg from "@bgord/ui";
import { Dialog, DialogHeader } from "../components";
import { catalogRoute } from "../router";
import { ExerciseCategoryAdd } from "./exercise-category-add";
import { ExerciseCategoryRow } from "./exercise-category-row";

export function ExerciseCategoryManage(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { exerciseCategories } = catalogRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);

  return (
    <Dialog {...toggle}>
      <DialogHeader onClose={toggle.disable}>
        {t("exercise.category.manage.header")}
        <span data-color="neutral-500" data-fw="regular" data-ml="2">
          · {exerciseCategories.data.length}
        </span>
      </DialogHeader>

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
            <ExerciseCategoryRow key={category.id} {...category} />
          ))}
        </ul>
      )}
    </Dialog>
  );
}
