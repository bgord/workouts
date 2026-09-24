import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Plus, X } from "lucide-react";
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
        }),
      }),
    onSuccess: bg.exec([exerciseCategoryId.clear, refresh, assignment.disable]),
  });

  if (!action.available) {
    return (
      <div data-stack="y" {...ui.Gap.cluster}>
        <h3>{t("exercise.categories.header")}</h3>

        <ul data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          {assigned.map((category) => (
            <li key={category.id}>
              <ui.ChipLink search={{ category: category.id }} to="/catalog">
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
      <div data-main="between" data-stack="x" {...bg.Rhythm().times(3).style.minHeight} {...ui.Gap.related}>
        <h3>{t("exercise.categories.header")}</h3>

        {assignment.off && (
          <div data-stack="x" {...ui.Gap.related}>
            <ui.ActionHint {...action} />

            <button
              className="c-button"
              data-variant="ghost"
              disabled={!action.enabled}
              onClick={assignment.enable}
              type="button"
              {...assignment.props.controller}
            >
              <Plus data-size="sm" />
              {t("exercise.category.assign.cta")}
            </button>
          </div>
        )}
      </div>

      {action.enabled && assignment.on && (
        <form
          aria-busy={assign.isLoading}
          data-stack="x"
          data-wrap="wrap"
          onSubmit={assign.handleSubmit}
          {...ui.Gap.inline}
          {...assignment.props.target}
        >
          <div data-md-grow="1">
            <ui.Select
              aria-label={t("exercise.category.assign.label")}
              disabled={!action.enabled}
              {...exerciseCategoryId.input.props}
            >
              {exercise.assignableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </ui.Select>
          </div>

          <ui.IconButton
            aria-label={t("exercise.category.assign.cta")}
            disabled={!action.enabled || assign.isLoading}
            title={t("exercise.category.assign.cta")}
            tone="positive"
            type="submit"
          >
            <Check data-size="sm" />
          </ui.IconButton>

          <ui.IconButton
            aria-label={t("app.cancel")}
            onClick={bg.exec([exerciseCategoryId.clear, assign.reset, assignment.disable])}
            title={t("app.cancel")}
          >
            <X data-size="sm" />
          </ui.IconButton>

          {assign.isError && <ui.Output data-width="100%">{t("exercise.category.assign.error")}</ui.Output>}
        </form>
      )}

      <ul data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
        {assigned.map((category) => (
          <li key={category.id}>
            <ui.Chip>
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
