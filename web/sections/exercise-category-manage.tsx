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

  if (!exerciseCategories.actions.manage.available) return null;

  return (
    <>
      <ui.ActionHint {...exerciseCategories.actions.manage} id="exercise-category-manage-hint" />

      <button
        className="c-button"
        data-md-grow="1"
        data-variant="ghost"
        disabled={!exerciseCategories.actions.manage.enabled}
        onClick={exerciseCategoryManage.enable}
        type="button"
        {...ui.describedByHint(exerciseCategories.actions.manage, "exercise-category-manage-hint")}
        {...exerciseCategoryManage.props.controller}
      >
        <Tags data-size="sm" />
        {t("exercise.category.manage.cta")}
      </button>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...exerciseCategoryManage}>
        <ui.DialogHeader onClose={exerciseCategoryManage.disable}>
          {t("exercise.category.manage.header")}
          <small data-ml="2">· {exerciseCategories.data.length}</small>
        </ui.DialogHeader>

        <ExerciseCategoryAdd />

        {exerciseCategories.data.length === 0 && (
          <ui.EmptyState>
            <ui.EmptyStateMessage>{t("exercise.category.list.empty")}</ui.EmptyStateMessage>

            <small>{t("exercise.category.list.empty.hint")}</small>
          </ui.EmptyState>
        )}

        {exerciseCategories.data.length > 0 && (
          <ul
            aria-label={t("exercise.category.manage.header")}
            data-md-minh="unset"
            data-minh="0"
            data-overflow="auto"
            data-stack="y"
          >
            {exerciseCategories.data.map((category, index) => (
              <ExerciseCategoryRow first={index === 0} key={category.id} {...category} />
            ))}
          </ul>
        )}
      </ui.Dialog>
    </>
  );
}
