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

  const actions = Object.values(exerciseCategories.actions);

  if (!actions.some((action) => action.available)) return null;

  return (
    <>
      <ui.ActionHint {...exerciseCategories.actions.add} />

      <button
        className="c-button"
        data-md-grow="1"
        data-variant="ghost"
        disabled={!actions.some((action) => action.enabled)}
        onClick={exerciseCategoryManage.enable}
        type="button"
        {...exerciseCategoryManage.props.controller}
      >
        <Tags data-size="sm" />
        {t("exercise.category.manage.cta")}
      </button>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...exerciseCategoryManage}>
        <ui.DialogHeader onClose={exerciseCategoryManage.disable}>
          {t("exercise.category.manage.header")}
        </ui.DialogHeader>

        <ExerciseCategoryAdd />

        {exerciseCategories.data.length === 0 && (
          <ui.EmptyState>
            <ui.EmptyStateMessage>{t("exercise.category.list.empty")}</ui.EmptyStateMessage>

            <ui.Meta>{t("exercise.category.list.empty.hint")}</ui.Meta>
          </ui.EmptyState>
        )}

        {exerciseCategories.data.length > 0 && (
          <ul data-md-minh="unset" data-minh="0" data-overflow="auto" data-stack="y">
            {exerciseCategories.data.map((category) => (
              <ExerciseCategoryRow key={category.id} {...category} />
            ))}
          </ul>
        )}
      </ui.Dialog>
    </>
  );
}
