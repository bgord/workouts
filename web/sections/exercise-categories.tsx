import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Plus, X } from "lucide-react";
import type { ExerciseGetResponse } from "../../modules/exercises/queries/get-exercise-with-categories";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { ExerciseCategoryUnassign } from "./exercise-category-unassign";

export function ExerciseCategories(props: { exercise: ExerciseGetResponse }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exerciseCategories } = exerciseRoute.useLoaderData();

  const assignment = bg.useToggle({ name: "exercise-category-assign" });

  const assigned = props.exercise.data.categories;
  const assignable = exerciseCategories.data.filter(
    (category) => !assigned.some((current) => current.id === category.id),
  );

  const exerciseCategoryId = bg.useTextField({
    name: "exercise-category-assign",
    defaultValue: assignable[0]?.id ?? "",
  });

  const refresh = () => router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });

  const assign = bg.useMutation({
    perform: async () =>
      fetch("/api/exercises/category/assign", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          exerciseId: props.exercise.data.id,
          exerciseCategoryId: exerciseCategoryId.value,
        }),
      }),
    onSuccess: bg.exec([refresh, assignment.disable]),
  });

  const assignActionAvailable = props.exercise.actions.categoryAssign.available && assignable.length > 0;

  return (
    <div data-gap="3" data-stack="y">
      <div
        data-cross="center"
        data-gap="3"
        data-main="between"
        data-stack="x"
        data-wrap="nowrap"
        {...bg.Rhythm().times(3).style.minHeight}
      >
        <ui.Eyebrow>{t("exercise.categories.header")}</ui.Eyebrow>

        {assignActionAvailable && assignment.off && (
          <button
            className="c-button"
            data-variant="ghost"
            disabled={!props.exercise.actions.categoryAssign.enabled}
            onClick={assignment.enable}
            type="button"
            {...assignment.props.controller}
          >
            <Plus data-size="sm" />
            {t("exercise.category.assign.cta")}
          </button>
        )}
      </div>

      {assignActionAvailable && assignment.on && (
        <form
          data-cross="center"
          data-gap="1"
          data-stack="x"
          data-wrap="nowrap"
          onSubmit={assign.handleSubmit}
          {...assignment.props.target}
        >
          <ui.Select
            aria-label={t("exercise.category.assign.label")}
            disabled={!props.exercise.actions.categoryAssign.enabled}
            {...exerciseCategoryId.input.props}
          >
            {assignable.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </ui.Select>

          <ui.IconButton
            aria-label={t("exercise.category.assign.cta")}
            disabled={!props.exercise.actions.categoryAssign.enabled || assign.isLoading}
            title={t("exercise.category.assign.cta")}
            tone="positive"
            type="submit"
          >
            <Check data-size="sm" />
          </ui.IconButton>

          <ui.IconButton
            aria-label={t("app.cancel")}
            onClick={bg.exec([assign.reset, assignment.disable])}
            title={t("app.cancel")}
          >
            <X data-size="sm" />
          </ui.IconButton>
        </form>
      )}

      <ul data-gap="2" data-stack="x" data-wrap="wrap">
        {assigned.map((category) => (
          <li key={category.id}>
            <ui.Chip>
              {category.name}

              {props.exercise.actions.categoryUnassign.available && (
                <ExerciseCategoryUnassign category={category} exerciseId={props.exercise.data.id} />
              )}
            </ui.Chip>
          </li>
        ))}

        {assigned.length === 0 && (
          <li data-color="neutral-500" data-fs="sm">
            {t("exercise.categories.empty")}
          </li>
        )}
      </ul>

      {assign.isError && <ui.Output>{t("exercise.category.assign.error")}</ui.Output>}
    </div>
  );
}
