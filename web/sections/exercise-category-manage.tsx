import * as bg from "@bgord/ui";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { Dialog, DialogHeader } from "../components";
import { catalogRoute } from "../router";
import { ExerciseCategoryAdd } from "./exercise-category-add";
import { ExerciseCategoryDelete } from "./exercise-category-delete";
import { ExerciseCategoryRename } from "./exercise-category-rename";

export function ExerciseCategoryManage(props: { toggle: bg.UseToggleReturnType }) {
  const t = bg.useTranslations();
  const { exerciseCategories } = catalogRoute.useLoaderData();

  return (
    <Dialog {...props.toggle}>
      <DialogHeader onClose={props.toggle.disable}>
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

function ExerciseCategoryRow(props: ExerciseCategory) {
  const { exerciseCategories } = catalogRoute.useLoaderData();
  const rename = bg.useToggle({ name: `exercise-category-rename-${props.id}` });

  return (
    <li
      data-bc="neutral-800"
      data-cross="center"
      data-gap="3"
      data-hover-bg={rename.off ? "alpha-subtle" : undefined}
      data-main="between"
      data-md-px={rename.off ? "0-5" : "0"}
      data-px={rename.off ? "2" : "0"}
      data-py="1-5"
      data-stack="x"
      data-wrap="nowrap"
    >
      {exerciseCategories.actions.rename.available ? (
        <ExerciseCategoryRename {...props} toggle={rename} />
      ) : (
        <div data-fs="sm">{props.name}</div>
      )}

      {exerciseCategories.actions.delete.available && rename.off && <ExerciseCategoryDelete {...props} />}
    </li>
  );
}
