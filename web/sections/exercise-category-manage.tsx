import * as bg from "@bgord/ui";
import { Tags } from "lucide-react";
import * as ui from "../components";
import { catalogRoute } from "../router";
import { ExerciseCategoryAdd } from "./exercise-category-add";
import { ExerciseCategoryRow } from "./exercise-category-row";

export function ExerciseCategoryManage() {
  const t = bg.useTranslations();
  const { exerciseCategories } = catalogRoute.useLoaderData();

  const exerciseCategoryManage = bg.useToggle({ name: "exercise-category-manage" });

  if (!exerciseCategories.actions.add.available) return null;

  return (
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

      <ui.Dialog {...exerciseCategoryManage}>
        <ui.DialogHeader onClose={exerciseCategoryManage.disable}>
          {t("exercise.category.manage.header")}
        </ui.DialogHeader>

        {exerciseCategories.actions.add.available && <ExerciseCategoryAdd />}

        {exerciseCategories.data.length === 0 && (
          <div data-cross="center" data-stack="y" {...ui.Spacing.empty}>
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
    </>
  );
}
