import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { ExerciseGetResponse } from "../../modules/exercises/queries/get-exercise-with-categories";
import { ActionHint, ButtonCancel, Select } from "../components";
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
      <div data-cross="center" data-main="between" data-gap="3" data-stack="x" data-wrap="wrap">
        <div data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase">
          {t("exercise.categories.header")}
        </div>

        {assignActionAvailable && (
          <button
            className="c-button"
            data-variant="ghost"
            disabled={!props.exercise.actions.categoryAssign.enabled}
            onClick={assignment.toggle}
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
          data-animation="grow-fade-in"
          data-cross="center"
          data-gap="2"
          data-mb="2"
          data-stack="x"
          onSubmit={assign.handleSubmit}
          {...assignment.props.target}
        >
          <Select
            aria-label={t("exercise.category.assign.label")}
            disabled={!props.exercise.actions.categoryAssign.enabled}
            {...exerciseCategoryId.input.props}
          >
            {assignable.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <button
            className="c-button"
            data-variant="secondary"
            disabled={!props.exercise.actions.categoryAssign.enabled || assign.isLoading}
            type="submit"
          >
            {t("exercise.category.assign.cta")}
          </button>

          <ButtonCancel onClick={bg.exec([assign.reset, assignment.disable])} />
        </form>
      )}

      <ul data-gap="1-5" data-stack="x" data-wrap="wrap">
        {assigned.map((category) => (
          <li className="c-badge" data-cross="center" data-gap="1" data-variant="outline" key={category.id}>
            {category.name}

            {props.exercise.actions.categoryUnassign.available && (
              <ExerciseCategoryUnassign category={category} exerciseId={props.exercise.data.id} />
            )}
          </li>
        ))}

        {assigned.length === 0 && (
          <li data-color="neutral-500" data-fs="sm">
            {t("exercise.categories.empty")}
          </li>
        )}
      </ul>

      {assign.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("exercise.category.assign.error")}
        </output>
      )}
    </div>
  );
}
