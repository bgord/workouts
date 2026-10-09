import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Plus, X } from "lucide-react";
import { ExerciseCategoryRoleOptions } from "../../modules/exercises/value-objects/exercise-category-role-options";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { ExerciseCategoryUnassign } from "./exercise-category-unassign";

export function ExerciseCategories() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();
  const action = exercise.actions.categoryAssign;

  const assignment = bg.useToggle({ name: "exercise-category-assign" });

  const assigned = exercise.data.categories;

  const exerciseCategoryId = bg.useTextField({
    name: "exercise-category-id",
    defaultValue: exercise.assignableCategories[0]?.id ?? "",
  });

  const role = bg.useTextField<ExerciseCategoryRoleOptions>({
    name: "exercise-category-role",
    defaultValue: ExerciseCategoryRoleOptions.primary,
  });

  const refresh = () =>
    router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true });

  const assign = bg.useMutation({
    perform: () =>
      fetch("/api/exercises/category/assign", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          exerciseId: exercise.data.id,
          exerciseCategoryId: exerciseCategoryId.value,
          role: role.value,
        }),
      }),
    onSuccess: bg.exec([exerciseCategoryId.clear, role.clear, refresh, assignment.disable]),
  });

  if (!action.available) {
    return (
      <div data-stack="y" {...ui.Gap.cluster}>
        <h3>{t("exercise.categories.header")}</h3>

        <ul aria-label={t("exercise.categories.header")} data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          {assigned.map((category) => (
            <li key={category.id}>
              <ui.ChipLink search={{ category: category.id }} to="/catalog">
                <ui.CategoryRoleIcon value={category.role} />
                {category.name}
              </ui.ChipLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <div data-stack="y" {...ui.Gap.inline}>
        <div
          data-main="between"
          data-md-wrap="wrap"
          data-stack="x"
          {...bg.Rhythm().times(3).style.minHeight}
          {...ui.Gap.related}
        >
          <h3>{t("exercise.categories.header")}</h3>

          {assignment.off && (
            <button
              className="c-button"
              data-variant="ghost"
              disabled={!action.enabled}
              onClick={assignment.enable}
              type="button"
              {...ui.describedByHint(action, "exercise-category-assign-hint")}
              {...assignment.props.controller}
            >
              <Plus data-size="sm" />
              {t("exercise.category.assign.cta")}
            </button>
          )}

          {action.enabled && assignment.on && (
            <form
              aria-busy={assign.isLoading}
              data-grow="1"
              data-md-width="100%"
              data-minw="0"
              data-stack="y"
              onSubmit={assign.handleSubmit}
              {...ui.Gap.inline}
              {...assignment.props.target}
            >
              <div data-stack="x" {...ui.Gap.inline}>
                <div data-grow="1" data-minw="0" data-stack="x">
                  <ui.Select
                    aria-label={t("exercise.category.assign.label")}
                    data-minw="0"
                    data-width="100%"
                    {...exerciseCategoryId.input.props}
                  >
                    {exercise.assignableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </ui.Select>
                </div>

                <div data-shrink="0">
                  <ui.Select aria-label={t("exercise.category.assign.role.label")} {...role.input.props}>
                    {Object.values(ExerciseCategoryRoleOptions).map((option) => (
                      <option key={option} value={option}>
                        {t(`exercise.category.role.${option}`)}
                      </option>
                    ))}
                  </ui.Select>
                </div>

                <ui.IconButton
                  aria-label={t("exercise.category.assign.cta")}
                  disabled={assign.isLoading}
                  title={t("exercise.category.assign.cta")}
                  tone="positive"
                  type="submit"
                >
                  <Check data-size="sm" />
                </ui.IconButton>

                <ui.IconButton
                  aria-label={t("app.cancel")}
                  onClick={bg.exec([exerciseCategoryId.clear, role.clear, assign.reset, assignment.disable])}
                  title={t("app.cancel")}
                >
                  <X data-size="sm" />
                </ui.IconButton>
              </div>

              {assign.isError && (
                <output aria-live="assertive" data-tone="danger" data-width="100%">
                  {t("exercise.category.assign.error")}
                </output>
              )}
            </form>
          )}
        </div>
        {assignment.off && <ui.ActionHint {...action} id="exercise-category-assign-hint" />}
      </div>

      <ul aria-label={t("exercise.categories.header")} data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
        {assigned.map((category) => (
          <li key={category.id}>
            <ui.Chip>
              <ui.CategoryRoleIcon value={category.role} />
              {category.name}

              <ExerciseCategoryUnassign {...category} />
            </ui.Chip>
          </li>
        ))}

        {assigned.length === 0 && <li data-color="neutral-500">{t("exercise.categories.empty")}</li>}
      </ul>
    </div>
  );
}
